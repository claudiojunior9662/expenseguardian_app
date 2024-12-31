import { BudgetCategory } from "../entities/budget-category.entity";
import BudgetCategoryInfraestructure from "../infraestructure/budget-category.infraestructure";

export default class UpdateBudgetCategoryService {
    async execute(userBudgetCategory: BudgetCategory, token: string) {
        const provider = new BudgetCategoryInfraestructure();
        return (await provider.updateBudgetCategory(userBudgetCategory, token));
    }
}