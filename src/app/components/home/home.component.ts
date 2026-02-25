import { Component, computed, effect, ElementRef, inject, input, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { DiagramCardComponent } from "../diagram-cards/diagram-card/diagram-card.component";
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
import { TotalTestsDiagramComponent } from "./total-tests-diagram/total-tests-diagram.component";
import { TodayStatsComponent } from "./today-stats/today-stats.component";
import { TotalTestedDrugsComponent } from "../diagram-cards/total-tested-drugs/total-tested-drugs.component";
import { DrugApprovalRatesComponent } from "../diagram-cards/drug-approval-rates/drug-approval-rates.component";
import { TestingProcessComponent } from "../diagram-cards/testing-process/testing-process.component";

@Component({
  selector: 'app-home',
  imports: [DiagramCardComponent, TotalTestsDiagramComponent, TodayStatsComponent, TotalTestedDrugsComponent, DrugApprovalRatesComponent, TestingProcessComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  date = new Date('2026-02-12');
}
