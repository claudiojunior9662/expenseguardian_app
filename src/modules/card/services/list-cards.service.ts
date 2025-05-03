import CardInfrastructure from "../infrastructure/card.infrastructure";

export default class ListCardsService {
    async execute(userId: number, token: string) {
        const provider = new CardInfrastructure();
        return (await provider.listCards(userId, token));
    }
}