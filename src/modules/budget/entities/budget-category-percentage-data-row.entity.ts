export interface BudgetCategoryPercentageDataRow {
    id: string;
    dataId?: number;
    percentage: number;
    budgetId: number;
    categoryId: number;
    categoryDescription?: string;
    isNew?: boolean;
}