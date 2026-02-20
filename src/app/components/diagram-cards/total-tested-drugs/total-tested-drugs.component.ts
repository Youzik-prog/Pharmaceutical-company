import { Component, computed, effect, ElementRef, inject, input, Signal, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Chart, Legend, registerables } from 'chart.js';
import { map } from 'rxjs';
import { COLOR_ACCENT, COLOR_ACCENT_2 } from 'src/app/constants/colors';
import { CURRENT_DATE } from 'src/app/constants/mainContants';
import { TestsService } from 'src/app/services/tests.service';
import { DiagramCard, Stat, TotalValue, Values } from 'src/app/types/types';
import { substractDaysFromDate } from 'src/app/utils/functions';

Chart.register(...registerables);

const showLastDays = 7;

@Component({
  selector: 'app-total-tested-drugs',
  imports: [],
  templateUrl: './total-tested-drugs.component.html',
  styleUrl: './total-tested-drugs.component.css',
  providers: [{provide: DiagramCard, useExisting: TotalTestedDrugsComponent}]
})
export class TotalTestedDrugsComponent implements DiagramCard  {

  currentDate = input(CURRENT_DATE);

  startDate = input<Date>(substractDaysFromDate(this.currentDate(), showLastDays));

  private readonly testsService = inject(TestsService);

  private chart?: Chart;

  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('totalTestedChart');
  
  chartData = toSignal(
    this.testsService.getTotalTestedDrugsStat(this.startDate(), this.currentDate())
  );
  
  totalTestedDrugsSum = toSignal(
    this.testsService.getTotalTestedDrugsStat(this.startDate(), this.currentDate()).pipe(
      map(stat => stat.dataset.reduce((acc, el) => acc + el, 0))
    )
  )

  totalCompletedDrugsSum = toSignal(
    this.testsService.getTotalTestedDrugsStat(this.startDate(), this.currentDate()).pipe(
      map(stat => stat.dataset2 ? stat.dataset2.reduce((acc, el) => acc + el, 0) : undefined)
    )
  );

  totalPastTestedDrugsSum = toSignal(
    this.testsService.getTotalTestedDrugsStat(substractDaysFromDate(this.startDate(), showLastDays), this.currentDate()).pipe(
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
      this.chart.destroy();
    } else {
      this.chart = new Chart(el, {
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
}
