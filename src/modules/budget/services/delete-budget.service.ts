import BudgetInfrastructure from "../infrastructure/budget.infrastructure";

export default class DeleteBudgetService {
    async execute(userBudgetId: number, token: string) {
        const provider = new BudgetInfrastructure();
        return (await provider.deleteBudget(userBudgetId, token));
    }
}