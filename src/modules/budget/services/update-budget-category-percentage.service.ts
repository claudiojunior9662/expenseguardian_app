import { BudgetCategoryPercentage } from "../entities/budget-category-percentage.entity";
import BudgetCategoryPercentageInfraestructure from "../infraestructure/budget-category-percentage.infraestructure";

export default class UpdateBudgetCategoryPercentageService {
    async execute(userBudgetCategoryPercentage: BudgetCategoryPercentage, token: string) {
        const provider = new BudgetCategoryPercentageInfraestructure();
        return (await provider.updateBudgetCategoryPercentage(userBudgetCategoryPercentage, token));
    }
}