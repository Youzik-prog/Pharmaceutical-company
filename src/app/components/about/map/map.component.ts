import { Component, signal } from '@angular/core';
import { COMPANY_DIRECTIONS } from 'src/app/constants/mainContants';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent {

  isCopied = signal<boolean>(false);

  copyDirections() {
    navigator.clipboard.writeText(this.DIRECTIONS.join(' '));
    this.isCopied.set(true);

    setTimeout(() => this.isCopied.set(false), 2000);
  }

  DIRECTIONS = COMPANY_DIRECTIONS;
}
