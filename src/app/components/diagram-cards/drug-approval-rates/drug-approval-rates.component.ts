import { Component, computed, effect, ElementRef, inject, input, signal, Signal, viewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Chart } from 'chart.js';
import { combineLatest, switchMap } from 'rxjs';
import { COLOR_ACCENT } from 'src/app/constants/colors';
import { SHOW_LAST_DAYS } from 'src/app/constants/mainContants';
import { TestsService } from 'src/app/services/tests.service';
import { DiagramCard, Stat, TotalValue, Values } from 'src/app/types/types';
import { formatChartDate, generateDateRange } from 'src/app/utils/functions';

@Component({
  selector: 'app-drug-approval-rates',
  imports: [],
  templateUrl: './drug-approval-rates.component.html',
  styleUrl: './drug-approval-rates.component.css',
  providers: [{provide: DiagramCard, useExisting: DrugApprovalRatesComponent}],
})
export class DrugApprovalRatesComponent extends DiagramCard {

  private readonly testsService = inject(TestsService);

  title = signal<string>('Drug approval rates');
  
  protected chart?: Chart;

  protected canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('drugApprovalRates');
  
  chartData = toSignal<Stat | undefined>(
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
  
  override totalValue = computed<TotalValue>(() => ({
    currentValue: this.totalApprovesSum(),
    pastValue: this.totalCompletedSum()
  }));

  constructor() {
    super();
  }

  drawChart(element: HTMLCanvasElement, data: Stat): void {
    const {startDate, endDate, dataset, dataset2} = data;

    const labels = generateDateRange(startDate, endDate).map(date => formatChartDate(date));

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
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Approved Tests',
            data: dataset2 ?? [],
            borderColor: COLOR_ACCENT,
            borderWidth: 2,
            pointRadius: 0
          },
          {
            label: 'Completed Tests',
            data: dataset,
            borderWidth: 2,
            borderColor: '#D8DCE8',
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 750,
          easing: 'easeInOutQuint',
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              callback: function(_, index) {
                
                const currentLabels = this.chart.data.labels as string[];

                if(index === 0 || index === currentLabels.length - 1) {
                  return currentLabels[index];
                }
                return '';
              },
              font: {
                size: 14,
              },
              align: 'inner',
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
            }
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
            border: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      },
      
    })
  }
}
