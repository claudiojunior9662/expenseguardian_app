import SpentTypeEnum from "../enums/spent-type.enum";

export interface Spent {
    id?: number;
    type: SpentTypeEnum;
    value: number;
    alreadyPaid: boolean;
    date: Date;
    description: string;
    budgetId: number;
    categoryId: number;
    cardId?: number;
    bankAccountId?: number;
}