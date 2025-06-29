'use client';

import React, { useState, useReducer, useCallback, useEffect } from 'react';
import PuzzleContext from './PuzzleContext';
import { Guess } from '../types-interfaces/Guess';
import { getOrSetUidToCookie } from '../utils/cookie';
import { getCurrentUTCDateString, msUntilNextUTCMidnight } from '../utils/dateUtils';
type PuzzleState = {
  guesses: Guess[];
  solved: boolean;
};

type LoadProgressResponse = {
  guesses: Guess[];
  solved: boolean;
};

type Action =
  | { type: 'ADD_GUESS'; guess: Guess }
  | { type: 'RESET' }
  | { type: 'LOAD'; state: PuzzleState };

const initialState: PuzzleState = {
  guesses: [],
  solved: false,
};

function puzzleReducer(state: PuzzleState, action: Action): PuzzleState {
  switch (action.type) {
    case 'ADD_GUESS':
      return {
        guesses: [action.guess, ...state.guesses],
        solved: action.guess.correct ? true : state.solved,
      };
    case 'RESET':
      return initialState;
    case 'LOAD':
      return action.state;
    default:
      return state;
  }
}

export default function PuzzleProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(puzzleReducer, initialState);
  const [loaded, setLoaded] = useState(false);
  const [currentDay, setCurrentDay] = useState(getCurrentUTCDateString());

  const resetPuzzle = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const submitGuess = useCallback(async (guessString: string) => {
    const res = await fetch("/api/validate", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guess: guessString }),
    });
    const result: Guess = await res.json();
    dispatch({ type: 'ADD_GUESS', guess: result });
    return result;
  }, []);

  // Load progress on mount and when day changes
  const loadProgress = useCallback(() => {
    getOrSetUidToCookie();
    fetch(`/api/load-progress`)
      .then(res => res.json() as Promise<LoadProgressResponse>)
      .then((data) => {
        if (data && data.guesses) {
          dispatch({ type: 'LOAD', state: { guesses: data.guesses, solved: data.solved } });
          setLoaded(true);
        }
      });
  }, []);

  useEffect(() => {
    loadProgress();
  }, [currentDay, loadProgress]);

  // Schedule a reset at the next UTC midnight
  useEffect(() => {
    const ms = msUntilNextUTCMidnight();
    const timeout = setTimeout(() => {
      setCurrentDay(getCurrentUTCDateString());
      setLoaded(false);
    }, ms + 100); // +100ms to ensure we're just after midnight

    return () => clearTimeout(timeout);
  }, [currentDay]);


  return (
    <PuzzleContext.Provider value={{ state, submitGuess, resetPuzzle, loaded, currentDay }}>
      {children}
    </PuzzleContext.Provider>
  );
}