import { Budget } from "../entities/budget.entity";
import BudgetInfraestructure from "../infraestructure/budget.infraestructure";

export default class CreateBudgetService {
    async execute(userBudget: Budget, token: string) {
        const provider = new BudgetInfraestructure();
        return (await provider.createBudget(userBudget, token));
    }
}