import { Component, inject, linkedSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { COMPANY_DIRECTIONS } from 'src/app/constants/mainContants';
import { formatAmericanHours, formatChartDate, formatGoogleDate } from 'src/app/utils/functions';

@Component({
  selector: 'app-migracalm-x',
  imports: [],
  templateUrl: './migracalm-x.component.html',
  styleUrl: './migracalm-x.component.css',
})
export class MigracalmXComponent {

  rounter = inject(Router);
  
  DIRECTIONS = COMPANY_DIRECTIONS;
  
  startDate = signal<Date>(new Date('2026-03-01T10:00:00'));
  
  endDate = signal<Date>(new Date('2026-03-08T16:00:00'));
  
  info = linkedSignal<{title: string, description: string}[]>(() => {
    const start = this.startDate();
    const end = this.endDate();

    return [{
      title: 'Location',
    description: this.DIRECTIONS.join(' ')
    },
    {
      title: 'Date & Time',
      description: `${formatChartDate(start)} - ${formatChartDate(end)} ${end.getFullYear()}
      ${formatAmericanHours(start)} - ${formatAmericanHours(end)} Eastern Daylight Time `
    }
  ]}
  )

  startProcessRedirection() {
    this.rounter.navigate(['/process']);
  }

  addToCalendar() {

    const base = 'https://www.google.com/calendar/render?action=TEMPLATE';
    const title = encodeURIComponent('Testing Process Appointment');
    const location = encodeURIComponent(this.DIRECTIONS.join(' '));

    const start = formatGoogleDate(this.startDate());
    const end = formatGoogleDate(this.endDate());
    const dates = `${start}/${end}`;

    const url = `${base}&text=${title}&location=${location}&dates=${dates}`;
  
    window.open(url, '_blank');
  }
}
