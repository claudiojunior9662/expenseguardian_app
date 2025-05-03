import CardTypeEnum from "../enums/card-type.enum";

export interface Card {
    id?: number;
    cardType: CardTypeEnum;
    number: string;
    dueDay: number;
    expirationMonth: number;
    expirationYear: number;
    userId: number;
}