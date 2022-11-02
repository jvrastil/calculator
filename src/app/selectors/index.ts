import { createSelector } from '@ngrx/store';
import { getCalculatorState, CalculatorState } from '../reducers';

export const getHistory = createSelector(
  getCalculatorState,
  (state: CalculatorState) => state.history,
);

export const getEntry = createSelector(getCalculatorState, (state: CalculatorState) => state.entry);
export const getError = createSelector(
  getCalculatorState,
  (state: CalculatorState) => state.infinityError,
);
