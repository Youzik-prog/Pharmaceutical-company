import { Component, computed, effect, ElementRef, inject, input, signal, Signal, viewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Chart } from 'chart.js';
import { combineLatest, switchMap } from 'rxjs';
import { SHOW_LAST_DAYS } from 'src/app/constants/mainContants';
import { TestsService } from 'src/app/services/tests.service';
import { DiagramCard, Stat, TotalValue, Values } from 'src/app/types/types';

@Component({
  selector: 'app-drug-approval-rates',
  imports: [],
  templateUrl: './drug-approval-rates.component.html',
  styleUrl: './drug-approval-rates.component.css',
  providers: [{provide: DiagramCard, useExisting: DrugApprovalRatesComponent}],
})
export class DrugApprovalRatesComponent extends DiagramCard {

  values?: Signal<Values[]> | undefined;

  private readonly testsService = inject(TestsService);

  title: Signal<string> = signal('Drug approval rates');
  
  protected chart?: Chart;

  protected canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('drugApprovalRates');
  
  chartData = toSignal(
    combineLatest([
      toObservable(this.startDate),
      toObservable(this.currentDate)
    ]).pipe(
      switchMap(([start, end]) => this.testsService.getDrugApprovalRates(start, end))
    )
  );

  totalApprovesSum = computed(() => this.chartData()?.dataset2?.reduce((acc, el) => acc + el, 0) ?? 0
  )

  totalCompletedSum = computed(() => this.chartData()?.dataset.reduce((acc, el) => acc + el, 0) ?? 0
  )
  
  totalValue?: Signal<TotalValue>= computed<TotalValue>(() => ({
    currentValue: this.totalApprovesSum(),
    pastValue: this.totalCompletedSum()
  }));

  constructor() {
    super();
  }

  drawChart(element: HTMLCanvasElement, data: Stat): void {

  }

  createChart(element: HTMLCanvasElement, labels: string[], startDate: Date, endDate: Date, dataset: number[], dataset2: number[] | undefined): void {

  }

}
