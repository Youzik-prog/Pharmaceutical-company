import { Component, effect, inject, signal, Signal } from '@angular/core';
import { DrugsService } from "../../services/drugs.service";
import { Drug } from 'src/app/types/types';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {

  private drugsService: DrugsService = inject(DrugsService);

  allDrugs: Signal<Drug[]> = toSignal(this.drugsService.getAllDrugs(), {initialValue: []});
}
