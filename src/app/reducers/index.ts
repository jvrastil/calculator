import { createAction, createFeatureSelector, createReducer, on, props } from '@ngrx/store';

enum AVAILABLE_MATH_OPERATORS {
  MINUS = ' - ',
  PLUS = ' + ',
  MULTIPLY = ' * ',
  DIVIDE = ' / ',
}

export interface CalculatorState {
  history: string[];
  entry: string;
  infinityError: boolean;
}

export const initialState: CalculatorState = {
  history: [],
  entry: '0',
  infinityError: false,
};

export const addHistoryItem = createAction('Add history item');
export const clearAll = createAction('Clear all');
export const clearEntry = createAction('Clear entry');
export const addDigit = createAction('Add digit', props<{ digit: number }>());
export const divide = createAction('Add divide operator');
export const multiply = createAction('Add multiplication operator');
export const minus = createAction('Add minus operator');
export const plus = createAction('Add plus operator');
export const addDecimalDot = createAction('Add decimal dot');
export const switchSign = createAction('Switch sign');
export const displayInfinityError = createAction('Display infinity error');
export const hideInfinityError = createAction('Hide infinity error');

// we need to use reverseString function to ensure replacing is applied to the last item
// otherwise switching sign will not work if same number is used in the expression (like 8 + 8 / 8)
export const calculatorReducer = createReducer(
  initialState,
  on(clearAll, state => ({ ...state, history: initialState.history, entry: initialState.entry })),
  on(clearEntry, state => ({ ...state, entry: initialState.entry })),
  on(addHistoryItem, state => {
    if (endsWithOperator(state) || state.entry.endsWith('.')) return state;

    return {
      ...state,
      history: [state.entry, ...state.history],
      entry: initialState.entry,
    };
  }),
  on(addDigit, (state, { digit }) => {
    let entry;
    const lastEntry = lastNumberInEntry(state);

    if (lastEntry === '0') {
      entry = state.entry.slice(0, -1) + digit.toString();
    } else if (lastEntry === '(-0)') {
      entry = `${state.entry.slice(0, -4)}(-${digit})`;
    } else if (lastEntry.startsWith('(-')) {
      entry = reverseString(
        reverseString(state.entry).replace(
          reverseString(lastEntry),
          reverseString(`(-${lastEntry.slice(2, -1)}${digit})`),
        ),
      );
    } else {
      entry = `${state.entry}${digit}`;
    }

    return { ...state, entry: entry };
  }),
  on(divide, state => {
    if (endsWithOperator(state)) return state;

    return {
      ...state,
      entry: `${state.entry}${AVAILABLE_MATH_OPERATORS.DIVIDE}`,
    };
  }),
  on(multiply, state => {
    if (endsWithOperator(state)) return state;

    return {
      ...state,
      entry: `${state.entry}${AVAILABLE_MATH_OPERATORS.MULTIPLY}`,
    };
  }),
  on(minus, state => {
    if (endsWithOperator(state)) return state;

    return {
      ...state,
      entry: `${state.entry}${AVAILABLE_MATH_OPERATORS.MINUS}`,
    };
  }),
  on(plus, state => {
    if (endsWithOperator(state)) return state;

    return {
      ...state,
      entry: `${state.entry}${AVAILABLE_MATH_OPERATORS.PLUS}`,
    };
  }),
  on(addDecimalDot, state => {
    const lastEntry = lastNumberInEntry(state);
    if (lastEntry.startsWith('(-') && lastEntry.indexOf('.') == -1) {
      return {
        ...state,
        entry: reverseString(
          reverseString(state.entry).replace(
            reverseString(lastEntry),
            reverseString(`(-${lastEntry.slice(2, -1)}.)`),
          ),
        ),
      };
    }

    return {
      ...state,
      entry: `${state.entry}${lastEntry.indexOf('.') > -1 ? '' : '.'}`,
    };
  }),
  on(switchSign, state => {
    const lastEntry = lastNumberInEntry(state);
    if (lastEntry.startsWith('(-')) {
      // remove minus sign in case it's already negative
      return {
        ...state,
        entry: state.entry.replace(lastEntry, lastEntry.slice(2, -1)),
      };
    }

    return {
      ...state,
      entry: reverseString(
        reverseString(state.entry).replace(
          reverseString(lastEntry),
          `)${reverseString(lastEntry)}-(`,
        ),
      ),
    };
  }),
  on(displayInfinityError, state => ({ ...state, infinityError: true })),
  on(hideInfinityError, state => ({ ...state, infinityError: false })),
);

function reverseString(str: string): string {
  if (str === '')
    // This is the terminal case that will end the recursion
    return '';
  else return reverseString(str.substr(1)) + str.charAt(0);
}

const lastNumberInEntry = (state: CalculatorState): string => {
  const replaceString = '|';

  let replacedEntry = state.entry;
  Object.values(AVAILABLE_MATH_OPERATORS).forEach(operator => {
    replacedEntry = replacedEntry.replace(operator, replaceString);
  });
  const result = replacedEntry.split(replaceString);

  return result[result.length - 1];
};

const endsWithOperator = (state: CalculatorState): boolean => {
  const replaceString = '|';

  let replacedEntry = state.entry;
  Object.values(AVAILABLE_MATH_OPERATORS).forEach(operator => {
    replacedEntry = replacedEntry.replace(operator, replaceString);
  });

  return replacedEntry.endsWith(replaceString);
};

export const getCalculatorState = createFeatureSelector<CalculatorState>('calculator');
