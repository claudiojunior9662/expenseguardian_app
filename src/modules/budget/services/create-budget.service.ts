import { Budget } from "../entities/budget.entity";
import BudgetInfrastructure from "../infrastructure/budget.infrastructure";

export default class CreateBudgetService {
    async execute(userBudget: Budget, token: string) {
        const provider = new BudgetInfrastructure();
        return (await provider.createBudget(userBudget, token));
    }
}