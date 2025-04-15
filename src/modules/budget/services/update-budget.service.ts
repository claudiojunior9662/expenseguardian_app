import { Budget } from "../entities/budget.entity";
import BudgetInfraestructure from "../infraestructure/budget.infraestructure";

export default class UpdateBudgetService {
    async execute(userBudget: Budget, token: string) {
        const provider = new BudgetInfraestructure();
        return (await provider.updateBudget(userBudget, token));
    }
}