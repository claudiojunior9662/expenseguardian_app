import { Card } from "../entities/card.entity";
import CardInfrastructure from "../infrastructure/card.infrastructure";

export default class UpdateCardService {
    async execute(userCard: Card, token: string) {
        const provider = new CardInfrastructure();
        return (await provider.updateCard(userCard, token));
    }
}