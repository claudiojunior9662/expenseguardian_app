import SpentInfrastructure from "../infrastructure/spent.infrastructure";

export default class DeleteSpentService {
    async execute(userSpentId: number, token: string) {
        const provider = new SpentInfrastructure();
        return (await provider.deleteSpent(userSpentId, token));
    }
}