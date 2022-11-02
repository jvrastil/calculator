import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { CalculatorEffects } from './effects';
import { EvaluatePipe } from './pipes/evaluate.pipe';
import { calculatorReducer } from './reducers';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [AppComponent, EvaluatePipe],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ calculator: calculatorReducer }),
    EffectsModule.forRoot([CalculatorEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
