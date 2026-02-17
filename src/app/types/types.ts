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
