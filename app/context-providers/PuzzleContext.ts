'use client';

import { createContext } from 'react';
import { ComparisonResult } from '../types-interfaces/ComparisonResult';

type Guess = {
  correct: boolean;
  comparisonResult: ComparisonResult;
};

type PuzzleState = {
  guesses: Guess[];
  solved: boolean;
  hint?: string;
};

type PuzzleContextType = {
  state: PuzzleState;
  submitGuess: (_guessString: string) => Promise<Guess>;
  resetPuzzle: () => void;
  loaded: boolean;
  currentDay: string;
};

const PuzzleContext = createContext<PuzzleContextType | null>(null);

export default PuzzleContext;