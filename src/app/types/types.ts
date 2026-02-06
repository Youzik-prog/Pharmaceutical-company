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