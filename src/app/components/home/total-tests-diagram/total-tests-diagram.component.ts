import { DatePipe } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, Signal, signal, viewChild, WritableSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Chart, registerables } from 'chart.js';
import { switchMap } from 'rxjs';
import { COLOR_ACCENT } from 'src/app/constants/colors';
import { CURRENT_DATE } from 'src/app/constants/mainContants';
import { SubstractDatePipe } from 'src/app/pipes/substract-date-pipe';
import { TestsService } from 'src/app/services/tests.service';
import { Stat } from 'src/app/types/types';
import { formatChartDate, generateDateRange, getSCCPropertyValue, substractDaysFromDate } from 'src/app/utils/functions';

Chart.register(...registerables);

const initDaysRange = 7;

@Component({
  selector: 'app-total-tests-diagram',
  imports: [SubstractDatePipe, DatePipe],
  templateUrl: './total-tests-diagram.component.html',
  styleUrl: './total-tests-diagram.component.css',
})
export class TotalTestsDiagramComponent {
  
  testsService = inject(TestsService);

  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('testsChart');

  private chart?: Chart;

  daysRange: WritableSignal<number> = signal(initDaysRange);

  currentDate = signal(CURRENT_DATE);

  startDate: Signal<Date> = computed(() => substractDaysFromDate(this.currentDate(), this.daysRange()));

  private params$ = toObservable(computed(() => ({
    start: this.startDate(),
    end: this.currentDate(),
  })));

  chartData = toSignal(
    this.params$.pipe(
      switchMap(params => this.testsService.getTotalTestedDrugsStat(params.start, params.end))
    )
  );

  constructor() {
    effect(() => {
      const data = this.chartData();
      if (!data) return;

      this.drawTotalTestsChart(data);
    });
  }

  onRangeChange(event: Event) {
    if(!event.target)
      return;

    const select = event.target as HTMLSelectElement;

    this.daysRange.set(+select.value);
  }

  drawTotalTestsChart(data: Stat) {
    const el = this.canvas().nativeElement;

    const {startDate, endDate, dataset, dataset2} = data;

    const labels = generateDateRange(startDate, endDate).map(date => formatChartDate(date));

    if(this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = dataset;
      this.chart.data.datasets[1].data = dataset2 ?? [];

      this.chart.update();
    } else {

      this.chart = new Chart(el, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Total Tests',
              data: dataset,
              borderColor: COLOR_ACCENT,
              borderWidth: 2,
              pointRadius: 0,
            },
            {
              label: 'Completed Tests',
              data: dataset2 ?? [],
              borderWidth: 2,
              borderColor: '#5CBCF0',
              borderDash: [2, 2],
              pointRadius: 0
            }
          ]
        },
        options: {
          animation: {
            duration: 750,
            easing: 'easeInOutQuint',
          },
          scales: {
            x: {
              grid: {
                display: true,
                drawOnChartArea: true,
              },
              ticks: {
                callback: function(_, index) {
                  
                  const currentLabels = this.chart.data.labels as string[];

                  if(index === 0 || index === Math.floor(currentLabels.length / 2) || index === currentLabels.length - 1) {
                    return currentLabels[index];
                  }
                  return '';
                },
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
        }
      });
    }
  }

}
