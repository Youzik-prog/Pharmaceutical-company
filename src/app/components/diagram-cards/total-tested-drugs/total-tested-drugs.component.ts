import { Component, computed, effect, ElementRef, inject, input, Signal, signal, viewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Chart, registerables } from 'chart.js';
import { combineLatest, map, switchMap, tap } from 'rxjs';
import { COLOR_ACCENT, COLOR_ACCENT_2 } from 'src/app/constants/colors';
import { CURRENT_DATE, SHOW_LAST_DAYS } from 'src/app/constants/mainContants';
import { TestsService } from 'src/app/services/tests.service';
import { DiagramCard, Stat, TotalValue, Values } from 'src/app/types/types';
import { substractDaysBetweenTwoDates, substractDaysFromDate } from 'src/app/utils/functions';

@Component({
  selector: 'app-total-tested-drugs',
  imports: [],
  templateUrl: './total-tested-drugs.component.html',
  styleUrl: './total-tested-drugs.component.css',
  providers: [{provide: DiagramCard, useExisting: TotalTestedDrugsComponent}]
})
export class TotalTestedDrugsComponent extends DiagramCard  {

  private readonly testsService = inject(TestsService);

  protected chart?: Chart;

  protected canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('totalTestedChart');
  
  chartData = toSignal(
    combineLatest([
      toObservable(this.startDate),
      toObservable(this.currentDate)
    ]).pipe(
      switchMap(([start, end]) => this.testsService.getTotalTestedDrugsStat(start, end))
    )
  );
  
  totalTestedDrugsSum = computed(() => 
    this.chartData()?.dataset.reduce((acc, el) => acc + el, 0) ?? 0
  );

  totalCompletedDrugsSum = computed(() => 
    this.chartData()?.dataset2?.reduce((acc, el) => acc + el, 0)
  );

  totalPastTestedDrugsSum = toSignal(
    combineLatest([
      toObservable(this.startDate),
      toObservable(this.currentDate)
    ]).pipe(
      switchMap(([start, end]) => this.testsService.getTotalTestedDrugsStat(
        substractDaysFromDate(
          start, 
          substractDaysBetweenTwoDates(end, start)), 
        end
        )
      ),
      map(stat => stat.dataset.reduce((acc, el) => acc + el, 0))
    )
  )

  title = signal<string>('Total tested drugs');
  
  totalValue = computed<TotalValue>(() => ({
    currentValue: this.totalTestedDrugsSum() ?? 0,
    pastValue: this.totalPastTestedDrugsSum()
  }));

  values: Signal<Values[]> | undefined = computed(() => {
    const completed = this.totalCompletedDrugsSum();
    const total = this.totalTestedDrugsSum();

    if(!completed || !total)
      return [];

    return [{
      name: 'Completed',
      value: completed,
    },
    {
      name: 'Awaiting results',
      value: (total - completed),
    }]
  });

  constructor() {
    super();
  }

  drawChart(element: HTMLCanvasElement, data: Stat) {

      const {startDate, endDate, dataset, dataset2} = data;

      const labels = dataset.map(() => '');

      if(this.chart) {  

      this.chart.data.datasets[0].data = dataset2 ?? [];
      this.chart.data.datasets[1].data = dataset;
      this.chart.data.labels = labels
      
      this.chart.update();

      } else {
      this.createChart(element, labels, startDate, endDate, dataset, dataset2);
      }
  }

  createChart(element: HTMLCanvasElement, labels: string[], startDate: Date, endDate: Date, dataset: number[], dataset2: number[] | undefined): void {
    this.chart = new Chart(element, {
      type: 'bar',
      data: {
        labels: dataset.map(() => ''),
        datasets: [{
          data: dataset2 ?? [],
          backgroundColor: COLOR_ACCENT,
          borderRadius: 100,
          borderSkipped: false,
          barThickness: 4,
        },
        {
          data: dataset.map(() => Math.max(...dataset)),
          backgroundColor: COLOR_ACCENT_2,
          borderRadius: 100,

          borderSkipped: false,
          barThickness: 4,
        },],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: false,
            stacked: true,
          },
          y: {
            display: false,
            stacked: false,
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        interaction: {
          intersect: false,
        }
      },
    })
  }
}
