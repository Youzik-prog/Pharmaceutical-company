import { Component, computed, effect, ElementRef, inject, input, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { DiagramCardComponent } from "../diagram-card/diagram-card.component";
import { Chart, registerables } from 'chart.js';
import { TestsService } from 'src/app/services/tests.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { formatChartDate, generateDateRange, getSCCPropertyValue, substractDaysFromDate } from 'src/app/utils/functions';
import { CURRENT_DATE } from 'src/app/constants/mainContants';
import { Drug, Stat } from 'src/app/types/types';
import { map, switchMap } from 'rxjs';
import { SubstractDatePipe } from 'src/app/pipes/substract-date-pipe';
import { DatePipe } from '@angular/common';
import { DrugsService } from 'src/app/services/drugs.service';

Chart.register(...registerables);

const initDaysRange = 7;

@Component({
  selector: 'app-home',
  imports: [DiagramCardComponent, SubstractDatePipe, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  testsService = inject(TestsService);

  drugsService = inject(DrugsService);

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

    // styles
    const accentColor = getSCCPropertyValue('--color-accent');

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
              borderColor: accentColor,
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
                  if(index === 0 || index === Math.floor(labels.length / 2) || index === labels.length - 1) {
                    return labels[index];
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
