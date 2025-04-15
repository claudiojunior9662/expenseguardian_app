import BudgetCategoryPercentageInfrastructure from "../infrastructure/budget-category-percentage.infrastructure";

export default class ListBudgetCategoryPercentagesService {
    async execute(budgetId: number, token: string) {
        const provider = new BudgetCategoryPercentageInfrastructure();
        return (await provider.listBudgetCategoryPercentages(budgetId, token));
    }
}