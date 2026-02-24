import { Component, inject, signal, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
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
  drugsService = inject(DrugsService);
  
  currentDate = signal<Date>(CURRENT_DATE);

  closestNonExpiredDrug = toSignal<Drug | undefined>(
    toObservable(this.currentDate).pipe(
      switchMap((current: Date) => this.drugsService.getNonExpiredDrugs(current)), 
      map(drugs => drugs[0])
    )
  );

  vaccinesOnHold = toSignal<number | undefined>(
    toObservable(this.currentDate).pipe(
      switchMap(date => this.testsService.getTestByDay(date)),
      map(test => test ? test.tests - test.completed : undefined)
    )
  );

  productsOutOfStock = toSignal<number | undefined>(
    toObservable(this.currentDate).pipe(
      switchMap(date => this.testsService.getTestByDay(date)),
      map(test => test ? test.completed - test.approves : undefined)
    )
  );
}
