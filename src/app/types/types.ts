import { computed, Directive, effect, ElementRef, input, InputSignal, signal, Signal, WritableSignal } from "@angular/core";
import { Chart } from "chart.js";
import { CURRENT_DATE, SHOW_LAST_DAYS } from "../constants/mainContants";
import { substractDaysFromDate } from "../utils/functions";

export type Process = {
    total: number;
    current: number;
}

export type Status = {
    healthy: number;
    unhealthy: number;
    dangerous: number;
    noEffect: number;
}

export interface Drug {
    id: number;
    name: string;
    location: string;
    startDate: string;
    endDate: string;
    successReaction: boolean;
    process: Process;
    status: Status
}

export type People = {
    amount: number,
    tested: number
}

export type TestingProcess = {
    preclinicalTesting: number,
    clinicalTrials: number,
    regulatoryApproval: number
}

export interface Test {
    date: string,
    tests: number,
    completed: number,
    approves: number,
    people: People,
    testingProcess: TestingProcess
}

export interface Stat {
    startDate: Date,
    endDate: Date,
    dataset: number[],
    dataset2?: number[]
}

export type TotalValue = {currentValue: number, pastValue?: number};
export type Values = {name: string, value: number};

@Directive()
export abstract class DiagramCard {
    abstract title: Signal<string>;
    totalValue: Signal<TotalValue | undefined> = signal(undefined);
    values: Signal<Values[] | undefined> = signal(undefined);
    
    protected abstract chart?: Chart;

    protected abstract canvas: Signal<ElementRef<HTMLCanvasElement>>;

    abstract chartData: Signal<Stat | undefined>;


    showLastDays = input<number>(SHOW_LAST_DAYS);
    
    currentDate = input<Date>(CURRENT_DATE);
    
    startDate = computed<Date>(() => substractDaysFromDate(this.currentDate(), this.showLastDays()));

    constructor() {

        effect(() => {
        const data = this.chartData();
        const element = this.canvas().nativeElement;
        if (!data) return;
        
        this.drawChart(element, data);
        });
    }

    abstract drawChart(element: HTMLCanvasElement, data: Stat): void;

    abstract createChart(element: HTMLCanvasElement, labels: string[], startDate: Date, endDate: Date, dataset: number[], dataset2: number[] | undefined): void
}