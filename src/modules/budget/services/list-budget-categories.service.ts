import BudgetCategoryInfraestructure from "../infraestructure/budget-category.infraestructure";

export default class ListBudgetCategoriesService {
    async execute(userId: number, token: string) {
        const provider = new BudgetCategoryInfraestructure();
        return (await provider.listBudgetCategories(userId, token));
    }
}