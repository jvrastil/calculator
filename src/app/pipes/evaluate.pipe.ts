import { Pipe, PipeTransform } from '@angular/core';
import * as math from 'mathjs';

@Pipe({
  name: 'evaluate',
})
export class EvaluatePipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value || value === '') return '';

    return math.evaluate(value);
  }
}
