import CardTypeEnum from "../enums/card-type.enum";

export interface CardDataRow {
    id?: string;
    dataId?: number;
    cardType: CardTypeEnum;
    number: string;
    dueDay: number;
    expirationMonth: number;
    expirationYear: number;
    userId: number;
    isNew?: boolean;
}