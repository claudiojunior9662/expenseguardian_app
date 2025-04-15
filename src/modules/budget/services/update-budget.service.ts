import { Budget } from "../entities/budget.entity";
import BudgetInfrastructure from "../infrastructure/budget.infrastructure";

export default class UpdateBudgetService {
    async execute(userBudget: Budget, token: string) {
        const provider = new BudgetInfrastructure();
        return (await provider.updateBudget(userBudget, token));
    }
}