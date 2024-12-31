import BudgetCategoryInfraestructure from "../infraestructure/budget-category.infraestructure";

export default class DeleteBudgetCategoryService {
    async execute(userBudgetCategoryId: number, token: string) {
        const provider = new BudgetCategoryInfraestructure();
        return (await provider.deleteBudgetCategory(userBudgetCategoryId, token));
    }
}