import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { placeBet } from '@/api/mock-api';
import { queryKeys } from '@/lib/query-client';
import { useGameStore } from '@/store';
import { useUser } from '@/hooks';
import type { Bet, CoinSide, Currency, PlaceBetInput } from '@/api/types';
import { INITIAL_SESSION } from './use-bet-simulation.constants';
import type { AutoSession, UseBetSimulationResult } from './use-bet-simulation.types';
import {
  createActiveSession,
  getNextAutoSession,
  stopSession,
  trimHistory,
} from './use-bet-simulation.utils';

export function useBetSimulation(): UseBetSimulationResult {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const { currency, betAmount, choice, autoBet } = useGameStore();

  const [session, setSession] = useState<AutoSession>(INITIAL_SESSION);
  const [lastBet, setLastBet] = useState<Bet | null>(null);

  // Refs mirror latest state for use inside mutation callbacks (fires after async work).
  const sessionRef = useRef<AutoSession>(INITIAL_SESSION);
  const autoConfigRef = useRef(autoBet);
  const currencyRef = useRef<Currency>(currency);
  const choiceRef = useRef<CoinSide>(choice);
  const manualAmountRef = useRef<number>(betAmount);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);
  useEffect(() => {
    autoConfigRef.current = autoBet;
  }, [autoBet]);
  useEffect(() => {
    currencyRef.current = currency;
  }, [currency]);
  useEffect(() => {
    choiceRef.current = choice;
  }, [choice]);
  useEffect(() => {
    manualAmountRef.current = betAmount;
  }, [betAmount]);

  // When the user turns off auto-bet, halt the running session.
  useEffect(() => {
    if (!autoBet.enabled && sessionRef.current.active) {
      setSession((prev) => ({ ...prev, active: false, stoppedReason: 'manual' }));
    }
  }, [autoBet.enabled]);

  const mutation = useMutation<Bet, Error, PlaceBetInput>({
    mutationFn: placeBet,
    onSuccess: (bet) => {
      setLastBet(bet);
      queryClient.setQueryData(queryKeys.history, (prev: Bet[] | undefined) => {
        const next = [bet, ...(prev ?? [])];
        return trimHistory(next);
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.user });

      if (!sessionRef.current.active) return;

      const { nextSession: newSession, stoppedReason } = getNextAutoSession(
        sessionRef.current,
        autoConfigRef.current,
        bet,
      );
      sessionRef.current = newSession;
      setSession(newSession);

      if (stoppedReason == null) {
        // schedule next bet after a short cosmetic pause
        setTimeout(() => {
          if (!sessionRef.current.active) return;
          mutation.mutate({
            currency: currencyRef.current,
            amount: newSession.currentBet,
            choice: choiceRef.current,
          });
        }, 450);
      }
    },
    onError: () => {
      if (sessionRef.current.active) {
        const stopped = stopSession(sessionRef.current, 'error');
        sessionRef.current = stopped;
        setSession(stopped);
      }
    },
  });

  const placeBetAction = useCallback(() => {
    if (mutation.isPending) return;
    const cfg = autoConfigRef.current;
    const startAuto = cfg.enabled && !sessionRef.current.active;

    const initialAmount = startAuto ? cfg.baseAmount : manualAmountRef.current;

    if (!user) return;
    const balance = user.balances[currencyRef.current];
    if (!Number.isFinite(initialAmount) || initialAmount <= 0) return;
    if (balance < initialAmount) return;

    if (startAuto) {
      const fresh = createActiveSession(initialAmount);
      sessionRef.current = fresh;
      setSession(fresh);
    }

    mutation.mutate({
      currency: currencyRef.current,
      amount: initialAmount,
      choice: choiceRef.current,
    });
  }, [mutation, user]);

  const stopAuto = useCallback(() => {
    if (!sessionRef.current.active) return;
    const stopped = stopSession(sessionRef.current, 'manual');
    sessionRef.current = stopped;
    setSession(stopped);
  }, []);

  return {
    placeBet: placeBetAction,
    stopAuto,
    isSpinning: mutation.isPending || session.active,
    lastBet,
    error: mutation.error,
    autoSession: session,
  };
}
