import { DecimalPipe } from '@angular/common';
import { Component, computed, ElementRef, inject, signal, Signal, viewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Chart, ChartTypeRegistry, Point, BubbleDataPoint } from 'chart.js';
import { combineLatest, switchMap } from 'rxjs';
import { COLOR_ACCENT, COLOR_ACCENT_3, COLOR_ACCENT_4 } from 'src/app/constants/colors';
import { TestsService } from 'src/app/services/tests.service';
import { DiagramCard, Stat, Values } from 'src/app/types/types';

@Component({
  selector: 'app-testing-process',
  imports: [DecimalPipe],
  templateUrl: './testing-process.component.html',
  styleUrl: './testing-process.component.css',
  providers: [{provide: DiagramCard, useExisting: TestingProcessComponent}]
})
export class TestingProcessComponent extends DiagramCard {

  testsService = inject(TestsService);

  override title = signal<string>('Testing process');

  protected chart?: Chart;
  
  protected canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('testingProcess');
  
  override chartData = toSignal<Stat | undefined>(
    combineLatest([
      toObservable(this.startDate),
      toObservable(this.currentDate)
    ]).pipe(
      switchMap(([start, end]) => this.testsService.getTestingProcessStat(start, end))
    )
  );

  override values = computed<Values[]>(() => {
    const chartData = this.chartData();

    if(!chartData) return [];

    return [
      {
        name: this.NAMES[0],
        value: chartData.dataset[0],
        color: this.COLORS[0]
      },
      {
        name: this.NAMES[1],
        value: chartData.dataset[1],
        color: this.COLORS[1]
      },
      {
        name: this.NAMES[2],
        value: chartData.dataset[2],
        color: this.COLORS[2]
      },
    ]
  });

  percent = computed<number>(() => {
    const values = this.values();

    if (values.length === 0) return 0;

    const sum = values.reduce((acc, value) => acc + value.value, 0);

    if (sum === 0) return 0;

    return values[0].value / sum * 100;
  })

  constructor() {
    super();
  }

  override drawChart(element: HTMLCanvasElement, data: Stat): void {
    const {startDate, endDate, dataset, dataset2} = data;

    const labels = this.NAMES;

    if(this.chart) {  
      this.chart.data.datasets[0].data = dataset;
      this.chart.data.labels = labels
      
      this.chart.update();
    } else {
      this.createChart(element, labels, startDate, endDate, dataset, dataset2);
    }
  }

  override createChart(element: HTMLCanvasElement, labels: string[], startDate: Date, endDate: Date, dataset: number[], dataset2: number[] | undefined): void {
    this.chart = new Chart(element, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: dataset,
          backgroundColor: this.COLORS,
          borderWidth: 0,
          spacing: 4,
          
        }]
      },
      options: {
        cutout: '90%',
        resizeDelay: 10,
        animation: {
          duration: 1500,
          easing: 'easeOutQuart',
          animateRotate: true,
        },
        plugins: {
          legend: {display: false},
          tooltip: {enabled: true},
        }
      }
    })
  }

  NAMES: string[] = ['Preclinical testing', 'Clinical trials', 'Regulatory approval'] as const;

  COLORS: string[] = [COLOR_ACCENT, COLOR_ACCENT_4, COLOR_ACCENT_3] as const;

}
