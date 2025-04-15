import { BudgetCategory } from "../entities/budget-category.entity";
import BudgetCategoryInfrastructure from "../infrastructure/budget-category.infrastructure";

export default class UpdateBudgetCategoryService {
    async execute(userBudgetCategory: BudgetCategory, token: string) {
        const provider = new BudgetCategoryInfrastructure();
        return (await provider.updateBudgetCategory(userBudgetCategory, token));
    }
}