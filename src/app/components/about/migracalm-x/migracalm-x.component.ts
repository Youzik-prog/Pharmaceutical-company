import { Component } from '@angular/core';

@Component({
  selector: 'app-migracalm-x',
  imports: [],
  templateUrl: './migracalm-x.component.html',
  styleUrl: './migracalm-x.component.css',
})
export class MigracalmXComponent {
  INFO: {title: string, description: string}[] = [
    {
    title: 'Location',
    description: `434 Rockaway Ave, ,BrooklynNew York,
11212-5636`
    },
    {
      title: 'Date & Time',
      description: `28th June - 2nd July 2022
10 am - 4 pm Eastern Daylight Time `
    }
  ]
}
