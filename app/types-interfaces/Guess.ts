import { ComparisonResult } from './ComparisonResult';

export interface Guess {
  correct: boolean;
  comparisonResult: ComparisonResult;
  hint?: string;
}
