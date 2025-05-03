import { Card } from "../entities/card.entity";
import CardInfrastructure from "../infrastructure/card.infrastructure";

export default class CreateCardService {
    async execute(userCard: Card, token: string) {
        const provider = new CardInfrastructure();
        return (await provider.createCard(userCard, token));
    }
}