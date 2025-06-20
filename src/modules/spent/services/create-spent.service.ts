import { Spent } from "../entities/spent.entity";
import SpentInfrastructure from "../infrastructure/spent.infrastructure";

export default class CreateSpentService {
    async execute(userSpent: Spent, token: string) {
        const provider = new SpentInfrastructure();
        return (await provider.createSpent(userSpent, token));
    }
}