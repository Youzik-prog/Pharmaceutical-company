import { Component, effect, inject, signal, Signal, WritableSignal } from '@angular/core';
import { DrugsService } from "../../services/drugs.service";
import { Drug } from 'src/app/types/types';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { formatDate, progressPercentage } from 'src/app/utils/functions';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {

  private drugsService: DrugsService = inject(DrugsService);

  public progressPercentage = progressPercentage;

  public formatDate = formatDate;

  loadedDrugs: WritableSignal<number> = signal(9); 

  allDrugs: Signal<Drug[]> = toSignal(
    toObservable(this.loadedDrugs).pipe(
      switchMap(amount => this.drugsService.getAllDrugs(amount))
    ),
    {initialValue: []}
  );

  allDrugsAmount: Signal<number> = toSignal(this.drugsService.getAllDrugsAmount(), {initialValue: 0});

  loadAllDrugs() {
    this.loadedDrugs.set(this.allDrugsAmount());
  }
}
