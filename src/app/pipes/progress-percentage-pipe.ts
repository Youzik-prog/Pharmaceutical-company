import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'progressPercentage',
})
export class ProgressPercentagePipe implements PipeTransform {

  transform(current: number, total: number | undefined): number {
    return total ? Math.round((current / total) * 100) : current;
  }

}
