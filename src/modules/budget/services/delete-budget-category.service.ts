import BudgetCategoryInfrastructure from "../infrastructure/budget-category.infrastructure";

export default class DeleteBudgetCategoryService {
    async execute(userBudgetCategoryId: number, token: string) {
        const provider = new BudgetCategoryInfrastructure();
        return (await provider.deleteBudgetCategory(userBudgetCategoryId, token));
    }
}