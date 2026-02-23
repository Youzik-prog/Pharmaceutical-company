import { input, InputSignal, Signal, WritableSignal } from "@angular/core";
import { Chart } from "chart.js";
import { CURRENT_DATE } from "../constants/mainContants";

export interface Drug {
    id: number;
    name: string;
    location: string;
    startDate: string;
    endDate: string;
    successReaction: boolean;
    process: {
        total: number;
        current: number;
    };
    status: {
        healthy: number;
        unhealthy: number;
        dangerous: number;
        noEffect: number;
    }
}

export interface Test {
    date: string,
    tests: number,
    completed: number,
    approves: number,
    people: {
        amount: number,
        tested: number
    },
    testingProcess: {
        preclinicalTesting: number,
        clinicalTrials: number,
        regulatoryApproval: number
    }
}

export interface Stat {
    startDate: Date,
    endDate: Date,
    dataset: number[],
    dataset2?: number[]
}

export type TotalValue = {currentValue: number, pastValue?: number};
export type Values = {name: string, value: number};

export abstract class DiagramCard {
    abstract title: Signal<string>;
    abstract showLastDays: InputSignal<number>;
    abstract totalValue?: Signal<TotalValue>;
    abstract values?: Signal<Values[]>;
}