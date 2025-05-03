import BankAccountInfrastructure from "../infraestructure/bank-account.infrastructure";

export default class ListBankAccountsService {
    async execute(userId: number, token: string) {
        const provider = new BankAccountInfrastructure();
        return (await provider.listBankAccounts(userId, token));
    }
}