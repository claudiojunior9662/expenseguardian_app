import CardInfrastructure from "../infrastructure/card.infrastructure";

export default class DeleteCardService {
    async execute(userCardId: number, token: string) {
        const provider = new CardInfrastructure();
        return (await provider.deleteCard(userCardId, token));
    }
}