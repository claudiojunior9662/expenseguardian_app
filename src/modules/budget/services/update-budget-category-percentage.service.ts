import { BudgetCategoryPercentage } from "../entities/budget-category-percentage.entity";
import BudgetCategoryPercentageInfrastructure from "../infrastructure/budget-category-percentage.infrastructure";

export default class UpdateBudgetCategoryPercentageService {
    async execute(userBudgetCategoryPercentage: BudgetCategoryPercentage, token: string) {
        const provider = new BudgetCategoryPercentageInfrastructure();
        return (await provider.updateBudgetCategoryPercentage(userBudgetCategoryPercentage, token));
    }
}