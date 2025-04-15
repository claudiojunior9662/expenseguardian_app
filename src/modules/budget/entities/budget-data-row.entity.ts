export interface BudgetDataRow {
    id: string;
    dataId?: number;
    month: number;
    year: number;
    salary: number;
    userId: number;
    isNew?: boolean;
}