import BudgetCategoryPercentageInfrastructure from "../infrastructure/budget-category-percentage.infrastructure";

export default class DeleteBudgetCategoryPercentageService {
    async execute(userBudgetCategoryPercentageId: number, token: string) {
        const provider = new BudgetCategoryPercentageInfrastructure();
        return (await provider.deleteBudgetCategoryPercentage(userBudgetCategoryPercentageId, token));
    }
}