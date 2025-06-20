import SpentInfrastructure from "../infrastructure/spent.infrastructure";

export default class ListSpentsByPeriodService {
    async execute(userId: number, initialDate: Date, finalDate: Date, token: string) {
        const provider = new SpentInfrastructure();
        return (await provider.listSpentsByPeriod(userId, initialDate, finalDate, token));
    }
}