import BudgetInfrastructure from "../infrastructure/budget.infrastructure";

export default class ListBudgetsService {
    async execute(userId: number, token: string) {
        const provider = new BudgetInfrastructure();
        return (await provider.listBudgets(userId, token));
    }
}