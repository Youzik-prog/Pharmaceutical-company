import { Component, effect, inject, signal, Signal, WritableSignal } from '@angular/core';
import { DrugsService } from "../../services/drugs.service";
import { Drug } from 'src/app/types/types';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ProgressPercentagePipe } from 'src/app/pipes/progress-percentage-pipe';
import { MultiProgressDirective } from 'src/app/directives/multi-progress.directive';

@Component({
  selector: 'app-table',
  imports: [DatePipe, ProgressPercentagePipe, MultiProgressDirective],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  standalone: true
})
export class TableComponent {

  private drugsService: DrugsService = inject(DrugsService);

  private initLoadedDrugsAmount = 9;

  loadedDrugs = signal<number>(this.initLoadedDrugsAmount); 

  allDrugs: Signal<Drug[]> = toSignal(
    toObservable(this.loadedDrugs).pipe(
      switchMap(amount => this.drugsService.getDrugs(amount))
    ),
    {initialValue: []}
  );

  allDrugsAmount: Signal<number> = toSignal(this.drugsService.getAllDrugsAmount(), {initialValue: 0});

  loadAllDrugs() {
    this.loadedDrugs.set(this.allDrugsAmount());
  }
}
