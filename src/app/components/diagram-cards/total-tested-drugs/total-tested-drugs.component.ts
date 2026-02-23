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
export class TotalTestedDrugsComponent implements DiagramCard  {

  private readonly testsService = inject(TestsService);

  showLastDays = input<number>(SHOW_LAST_DAYS);
  
  currentDate = input(CURRENT_DATE);
  
  startDate = computed(() => substractDaysFromDate(this.currentDate(), this.showLastDays()));

  private chart?: Chart;

  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('totalTestedChart');
  
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
    effect(() => {
      const data = this.chartData();
      if (!data) return;

      this.drawChart(data);
    });
  }

  drawChart(data: Stat) {
    const el = this.canvas().nativeElement;

    const {startDate, endDate, dataset, dataset2} = data;

    if(this.chart) {  

      this.chart.data.datasets[0].data = dataset2 ?? [];
      this.chart.data.datasets[1].data = dataset;
      this.chart.data.labels = dataset.map(() => '');
      
      this.chart.update();

    } else {
      this.createChart(el, dataset, dataset2);
    }
  }

  private createChart(element: HTMLCanvasElement, dataset: number[], dataset2: number[] | undefined): void {
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
