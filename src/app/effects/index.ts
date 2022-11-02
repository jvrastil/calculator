import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { concatMap, delay, map, of, withLatestFrom } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  addHistoryItem,
  CalculatorState,
  displayInfinityError,
  hideInfinityError,
} from '../reducers';
import { getHistory } from '../selectors';

import * as math from 'mathjs';

@Injectable()
export class CalculatorEffects {
  showNumericError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addHistoryItem.type),
      concatMap(action => of(action).pipe(withLatestFrom(this.store.pipe(select(getHistory))))),
      map((history: any) => {
        if (math.evaluate(history[1][0]) == Infinity || isNaN(math.evaluate(history[1][0]))) {
          return displayInfinityError();
        }
        return hideInfinityError();
      }),
    ),
  );

  hideNumericError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(displayInfinityError.type),
      delay(5000),
      map(() => hideInfinityError()),
    ),
  );

  constructor(private actions$: Actions, private store: Store<CalculatorState>) {}
}
