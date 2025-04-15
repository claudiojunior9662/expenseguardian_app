import BudgetCategoryInfrastructure from "../infrastructure/budget-category.infrastructure";

export default class ListBudgetCategoriesService {
    async execute(userId: number, token: string) {
        const provider = new BudgetCategoryInfrastructure();
        return (await provider.listBudgetCategories(userId, token));
    }
}