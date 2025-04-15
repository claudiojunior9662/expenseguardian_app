import BudgetCategoryPercentageInfraestructure from "../infraestructure/budget-category-percentage.infraestructure";

export default class DeleteBudgetCategoryPercentageService {
    async execute(userBudgetCategoryPercentageId: number, token: string) {
        const provider = new BudgetCategoryPercentageInfraestructure();
        return (await provider.deleteBudgetCategoryPercentage(userBudgetCategoryPercentageId, token));
    }
}