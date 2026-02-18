import { Pipe, PipeTransform } from '@angular/core';
import { substractDaysFromDate } from '../utils/functions';

@Pipe({
  name: 'substractDate',
})
export class SubstractDatePipe implements PipeTransform {

  transform(date: Date, days: number): Date {
    return substractDaysFromDate(date, days);
  }

}
