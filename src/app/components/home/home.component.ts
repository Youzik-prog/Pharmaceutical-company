import { Component, effect, ElementRef, inject, input, viewChild } from '@angular/core';
import { DiagramCardComponent } from "../diagram-card/diagram-card.component";
import { Chart, registerables } from 'chart.js';
import { TestsService } from 'src/app/services/tests.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { formatChartDate, generateDateRange, getSCCPropertyValue } from 'src/app/utils/functions';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  imports: [DiagramCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  testsService = inject(TestsService);

  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('testsChart');

  private chart?: Chart;

  constructor() {
    this.drawTotalTestsChart();


  }

  drawTotalTestsChart() {
    const data = toSignal(this.testsService.getTotalTestedDrugsStat(new Date('2026-02-01'), new Date('2026-02-28')));

    effect(() => {

      if(!data())
        return;

      const el = this.canvas().nativeElement;

      const {startDate, endDate, dataset, dataset2} = data()!;

      const labels = generateDateRange(startDate, endDate).map(date => formatChartDate(date));

      // styles
      const accentColor = getSCCPropertyValue('--color-accent');

      if(this.chart)
        this.chart.destroy();

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
          scales: {
            x: {
              grid: {
                display: true,
                drawOnChartArea: true,
              },
              ticks: {
                callback: function(val, index) {
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
    });
  }

}
