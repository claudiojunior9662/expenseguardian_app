import SpentTypeEnum from "../enums/spent-type.enum";

export interface SpentDataRow {
    id?: string;
    dataId?: number;
    type: SpentTypeEnum;
    value: number;
    alreadyPaid: boolean;
    date: Date;
    description: string;
    budgetId: number;
    categoryId: number;
    cardId?: number;
    bankAccountId?: number;
    isNew?: boolean;
}