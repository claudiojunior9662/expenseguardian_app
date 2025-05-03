import BankAccountTypeEnum from "../enums/bank-account-type.enum";

export interface BankAccountDataRow {
    id?: string;
    dataId?: number;
    type: BankAccountTypeEnum;
    name: string;
    number: string;
    balance: number;
    userId: number;
    isNew?: boolean;
}