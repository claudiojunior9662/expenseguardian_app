import BankAccountTypeEnum from "../enums/bank-account-type.enum";

export interface BankAccount {
    id?: number;
    type: BankAccountTypeEnum;
    name: string;
    number: string;
    balance: number;
    userId: number;
}