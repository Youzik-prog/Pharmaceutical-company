import { Injectable } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  private isRegistered = false;

  registerCharts() {
    if(!this.isRegistered) {
      Chart.register(...registerables);
      this.isRegistered = true;
    }
  }
}
