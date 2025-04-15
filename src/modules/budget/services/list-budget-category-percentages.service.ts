import BudgetCategoryPercentageInfraestructure from "../infraestructure/budget-category-percentage.infraestructure";

export default class ListBudgetCategoryPercentagesService {
    async execute(budgetId: number, token: string) {
        const provider = new BudgetCategoryPercentageInfraestructure();
        return (await provider.listBudgetCategoryPercentages(budgetId, token));
    }
}