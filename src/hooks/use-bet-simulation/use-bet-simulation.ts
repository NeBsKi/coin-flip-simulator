import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { placeBet } from '@/api/mock-api';
import { queryKeys } from '@/lib/query-client';
import { useGameStore } from '@/store';
import { useUser } from '@/hooks';
import type { Bet, CoinSide, Currency, PlaceBetInput } from '@/api/types';
import type { AutoBetConfig } from '@/store/game-store';
import { INITIAL_SESSION } from './use-bet-simulation.constants';
import type { AutoSession, StopReason, UseBetSimulationResult } from './use-bet-simulation.types';
import {
  createActiveSession,
  getNextAutoSession,
  stopSession,
  trimHistory,
} from './use-bet-simulation.utils';

interface ActiveAutoRun extends AutoBetConfig {
  currency: Currency;
  choice: CoinSide;
}

export function useBetSimulation(): UseBetSimulationResult {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const { currency, betAmount, choice, autoBet } = useGameStore();

  const [session, setSession] = useState<AutoSession>(INITIAL_SESSION);
  const [lastBet, setLastBet] = useState<Bet | null>(null);

  const sessionRef = useRef<AutoSession>(INITIAL_SESSION);
  const activeAutoRunRef = useRef<ActiveAutoRun | null>(null);
  const nextBetTimeoutRef = useRef<number | null>(null);

  const clearNextBetTimeout = useCallback(() => {
    if (nextBetTimeoutRef.current == null) return;

    window.clearTimeout(nextBetTimeoutRef.current);
    nextBetTimeoutRef.current = null;
  }, []);

  const syncSession = useCallback((nextSession: AutoSession) => {
    sessionRef.current = nextSession;
    setSession(nextSession);
  }, []);

  const stopAuto = useCallback(
    (reason: StopReason = 'manual') => {
      if (!sessionRef.current.active) return;

      clearNextBetTimeout();
      activeAutoRunRef.current = null;
      syncSession(stopSession(sessionRef.current, reason));
    },
    [clearNextBetTimeout, syncSession],
  );

  useEffect(() => {
    if (!autoBet.enabled) {
      stopAuto('manual');
    }
  }, [autoBet.enabled, stopAuto]);

  useEffect(() => clearNextBetTimeout, [clearNextBetTimeout]);

  const mutation = useMutation<Bet, Error, PlaceBetInput>({
    mutationFn: placeBet,
    onSuccess: (bet) => {
      setLastBet(bet);
      queryClient.setQueryData(queryKeys.history, (prev: Bet[] | undefined) => {
        const next = [bet, ...(prev ?? [])];
        return trimHistory(next);
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.user });

      const activeAutoRun = activeAutoRunRef.current;
      if (!sessionRef.current.active || !activeAutoRun) return;

      const { nextSession: newSession, stoppedReason } = getNextAutoSession(
        sessionRef.current,
        activeAutoRun,
        bet,
      );
      syncSession(newSession);

      if (stoppedReason == null) {
        clearNextBetTimeout();
        nextBetTimeoutRef.current = window.setTimeout(() => {
          const run = activeAutoRunRef.current;
          if (!sessionRef.current.active || !run) return;

          mutation.mutate({
            currency: run.currency,
            amount: newSession.currentBet,
            choice: run.choice,
          });
        }, 450);
      } else {
        activeAutoRunRef.current = null;
      }
    },
    onError: () => {
      if (sessionRef.current.active) {
        stopAuto('error');
      }
    },
  });

  const placeBetAction = useCallback(() => {
    if (mutation.isPending) return;
    const startAuto = autoBet.enabled && !sessionRef.current.active;

    const initialAmount = startAuto ? autoBet.baseAmount : betAmount;

    if (!user) return;
    const balance = user.balances[currency];
    if (!Number(initialAmount) || initialAmount <= 0) return;
    if (balance < initialAmount) return;

    if (startAuto) {
      activeAutoRunRef.current = {
        currency,
        choice,
        enabled: true,
        baseAmount: autoBet.baseAmount,
        stopWin: autoBet.stopWin,
        stopLoss: autoBet.stopLoss,
      };
      syncSession(createActiveSession(initialAmount));
    }

    mutation.mutate({
      currency,
      amount: initialAmount,
      choice,
    });
  }, [autoBet, betAmount, choice, currency, mutation, syncSession, user]);

  return {
    placeBetAction,
    stopAuto,
    isSpinning: mutation.isPending || session.active,
    lastBet,
    error: mutation.error,
    autoSession: session,
  };
}
