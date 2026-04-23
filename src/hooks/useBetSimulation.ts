import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { placeBet } from '@/api/mockApi';
import { queryKeys } from '@/lib/queryClient';
import { useGameStore } from '@/store';
import { useUser } from '@/hooks';
import type { Bet, CoinSide, Currency } from '@/api/types';

export type StopReason = 'stopWin' | 'stopLoss' | 'insufficientBalance' | 'manual' | 'error';

export interface AutoSession {
  active: boolean;
  runs: number;
  profit: number;
  currentBet: number;
  stoppedReason: StopReason | null;
}

const INITIAL_SESSION: AutoSession = {
  active: false,
  runs: 0,
  profit: 0,
  currentBet: 0,
  stoppedReason: null,
};

interface UseBetSimulationResult {
  placeBet: () => void;
  stopAuto: () => void;
  isSpinning: boolean;
  lastBet: Bet | null;
  error: Error | null;
  autoSession: AutoSession;
}

export function useBetSimulation(): UseBetSimulationResult {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const { currency, betAmount, choice, autoBet } = useGameStore();

  const [session, setSession] = useState<AutoSession>(INITIAL_SESSION);
  const [lastBet, setLastBet] = useState<Bet | null>(null);

  // Refs mirror latest state for use inside mutation callbacks (fires after async work).
  const sessionRef = useRef<AutoSession>(INITIAL_SESSION);
  const autoEnabledRef = useRef(autoBet.enabled);
  const autoConfigRef = useRef(autoBet);
  const currencyRef = useRef<Currency>(currency);
  const choiceRef = useRef<CoinSide>(choice);
  const manualAmountRef = useRef<number>(betAmount);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);
  useEffect(() => {
    autoEnabledRef.current = autoBet.enabled;
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

  const mutation = useMutation({
    mutationFn: placeBet,
    onSuccess: (bet) => {
      setLastBet(bet);
      queryClient.setQueryData(queryKeys.history, (prev: Bet[] | undefined) => {
        const next = [bet, ...(prev ?? [])];
        return next.slice(0, 20);
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.user });

      if (!sessionRef.current.active) return;

      const cfg = autoConfigRef.current;
      const delta = bet.outcome === 'win' ? bet.amount : -bet.amount;
      const nextProfit = sessionRef.current.profit + delta;
      const nextBetAmount = bet.outcome === 'loss' ? bet.amount * 2 : cfg.baseAmount;

      let stoppedReason: StopReason | null = null;
      if (cfg.stopWin != null && nextProfit >= cfg.stopWin) stoppedReason = 'stopWin';
      else if (cfg.stopLoss != null && nextProfit <= -cfg.stopLoss) stoppedReason = 'stopLoss';
      else if (bet.balanceAfter != null && bet.balanceAfter < nextBetAmount)
        stoppedReason = 'insufficientBalance';

      const newSession: AutoSession = {
        active: stoppedReason == null,
        runs: sessionRef.current.runs + 1,
        profit: nextProfit,
        currentBet: nextBetAmount,
        stoppedReason,
      };
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
        const stopped: AutoSession = {
          ...sessionRef.current,
          active: false,
          stoppedReason: 'error',
        };
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
      const fresh: AutoSession = {
        active: true,
        runs: 0,
        profit: 0,
        currentBet: initialAmount,
        stoppedReason: null,
      };
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
    const stopped: AutoSession = {
      ...sessionRef.current,
      active: false,
      stoppedReason: 'manual',
    };
    sessionRef.current = stopped;
    setSession(stopped);
  }, []);

  return {
    placeBet: placeBetAction,
    stopAuto,
    isSpinning: mutation.isPending || session.active,
    lastBet,
    error: mutation.error as Error | null,
    autoSession: session,
  };
}
