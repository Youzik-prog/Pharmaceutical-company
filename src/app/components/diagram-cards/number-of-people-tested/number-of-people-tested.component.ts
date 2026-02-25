import { Component, computed, ElementRef, inject, signal, Signal, viewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Chart, ChartTypeRegistry, Point, BubbleDataPoint } from 'chart.js';
import { combineLatest, switchMap } from 'rxjs';
import { COLOR_ACCENT, COLOR_ACCENT_2 } from 'src/app/constants/colors';
import { TestsService } from 'src/app/services/tests.service';
import { DiagramCard, Stat, Values } from 'src/app/types/types';

@Component({
  selector: 'app-number-of-people-tested',
  imports: [],
  templateUrl: './number-of-people-tested.component.html',
  styleUrl: './number-of-people-tested.component.css',
  providers: [{provide: DiagramCard, useExisting: NumberOfPeopleTestedComponent}]
})
export class NumberOfPeopleTestedComponent extends DiagramCard {

  testsService = inject(TestsService);

  override title = signal<string>('Number of people tested');

  protected chart?: Chart;

  protected canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('numberOfPeopleTested');

  override chartData = toSignal<Stat | undefined>(
    combineLatest([
      toObservable(this.startDate),
      toObservable(this.currentDate)
    ]).pipe(
      switchMap(([start, end]) => this.testsService.getNumberOfPeopleTestedStat(start, end))
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
    ]
  });

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
        datasets: [{
          data: dataset,
          backgroundColor: this.COLORS,
          borderWidth: 0,
          borderRadius: 8,
        }],
      },
      options: {
        rotation: 270,
        circumference: 180,

        cutout: '87%',
        responsive: true,
        maintainAspectRatio: false,

        animation: {
          duration: 1500,
          easing: 'easeOutQuart',
          animateRotate: true,
          animateScale: false
        },
        
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
        },

        layout: {
          padding: {
              bottom: 0
          }
        }
      }
    })
  }

    NAMES: string[] = ['Tested', 'Non-tested'] as const;
  
    COLORS: string[] = [COLOR_ACCENT, COLOR_ACCENT_2] as const;

}
