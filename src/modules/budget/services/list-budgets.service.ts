import BudgetInfraestructure from "../infraestructure/budget.infraestructure";

export default class ListBudgetsService {
    async execute(userId: number, token: string) {
        const provider = new BudgetInfraestructure();
        return (await provider.listBudgets(userId, token));
    }
}