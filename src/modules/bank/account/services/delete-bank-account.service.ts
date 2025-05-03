import BankAccountInfrastructure from "../infraestructure/bank-account.infrastructure";

export default class DeleteBankAccountService {
    async execute(userBankAccountId: number, token: string) {
        const provider = new BankAccountInfrastructure();
        return (await provider.deleteBankAccount(userBankAccountId, token));
    }
}