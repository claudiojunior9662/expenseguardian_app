import { BankAccount } from "../entities/bank-account.entity";
import BankAccountInfrastructure from "../infraestructure/bank-account.infrastructure";

export default class CreateBankAccountService {
    async execute(userBankAccount: BankAccount, token: string) {
        const provider = new BankAccountInfrastructure();
        return (await provider.createBankAccount(userBankAccount, token));
    }
}