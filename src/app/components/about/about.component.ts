import { Component } from '@angular/core';
import { MigracalmXComponent } from './migracalm-x/migracalm-x.component';
import { MapComponent } from './map/map.component';

@Component({
  selector: 'app-about',
  imports: [MigracalmXComponent, MapComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {

}
