import { Component, inject, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { CURRENT_DATE } from 'src/app/constants/mainContants';
import { DrugsService } from 'src/app/services/drugs.service';
import { TestsService } from 'src/app/services/tests.service';
import { Drug } from 'src/app/types/types';

@Component({
  selector: 'app-today-stats',
  imports: [],
  templateUrl: './today-stats.component.html',
  styleUrl: './today-stats.component.css',
})
export class TodayStatsComponent {
  
  testsService = inject(TestsService);

  currentDate = signal(CURRENT_DATE);

  drugsService = inject(DrugsService);

  closestNonExpiredDrug: Signal<Drug | undefined> = toSignal(this.drugsService.getNonExpiredDrugs(this.currentDate())
  .pipe(map(drugs => drugs[0])));

  vaccinesOnHold: Signal<number | undefined> = toSignal(
    this.testsService.getTestByDay(this.currentDate()).pipe(
      map(test => {
        if(!test)
          return undefined;

        return test.tests - test.completed;
      })
    )
  )

  productsOutOfStock: Signal<number | undefined> = toSignal(
    this.testsService.getTestByDay(this.currentDate()).pipe(
      map(test => {
        if(!test)
          return undefined;

        return test.completed - test.approves;
      })
    )
  )
}
