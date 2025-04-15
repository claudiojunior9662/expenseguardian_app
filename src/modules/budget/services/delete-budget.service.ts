import BudgetInfraestructure from "../infraestructure/budget.infraestructure";

export default class DeleteBudgetService {
    async execute(userBudgetId: number, token: string) {
        const provider = new BudgetInfraestructure();
        return (await provider.deleteBudget(userBudgetId, token));
    }
}