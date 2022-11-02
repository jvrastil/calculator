import { Component, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import {
  addDecimalDot,
  addDigit,
  addHistoryItem,
  CalculatorState,
  clearAll,
  clearEntry,
  divide,
  minus,
  multiply,
  plus,
  switchSign,
} from './reducers';
import { getEntry, getError, getHistory } from './selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  title = 'calculator';

  history$: Observable<string[]>;
  entry$: Observable<string>;
  error$: Observable<boolean>;

  historyLength = 0;
  subscription = new Subscription();

  constructor(private store: Store<CalculatorState>) {
    this.history$ = this.store.pipe(select(getHistory));
    this.entry$ = this.store.pipe(select(getEntry));
    this.error$ = this.store.pipe(select(getError));

    this.subscription.add(
      this.history$.subscribe(history => {
        this.historyLength = history.length;

        if (this.historyLength > 0) {
          // need to wait until new item is added into memory
          setTimeout(() => {
            const element = document.getElementById('0');
            if (!!element) element.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  clearEntry() {
    this.store.dispatch(clearEntry());
  }

  allClear() {
    this.store.dispatch(clearAll());
  }

  switchSign() {
    this.store.dispatch(switchSign());
  }

  pressEquals() {
    this.store.dispatch(addHistoryItem());
  }

  pressNumber(num: number) {
    this.store.dispatch(
      addDigit({
        digit: num,
      }),
    );
  }

  pressDot() {
    this.store.dispatch(addDecimalDot());
  }

  pressSlash() {
    this.store.dispatch(divide());
  }

  pressPlus() {
    this.store.dispatch(plus());
  }

  pressMinus() {
    this.store.dispatch(minus());
  }

  pressTimes() {
    this.store.dispatch(multiply());
  }
}
