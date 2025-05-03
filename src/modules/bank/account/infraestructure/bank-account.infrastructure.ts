import axios, { AxiosResponse } from "axios";
import { BankAccount } from "../entities/bank-account.entity";

export default class BankAccountInfrastructure {

    private readonly axiosComponent = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
    });

    async createBankAccount(bankAccount: BankAccount, token: string): Promise<AxiosResponse<unknown, unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }
    
            return (await this.axiosComponent.post('/bank-account/create', bankAccount, { headers }));
        } catch (error) {
            throw new Error('Error while creating bank account : ' + error);
        }
    }

    async listBankAccounts(userId: number, token: string): Promise<AxiosResponse<BankAccount[], unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            return (await this.axiosComponent.get('/bank-account/list/' + userId, { headers }));
        } catch (error) {
            throw new Error('Error while listing bank accounts: ' + error);
        }
    }

    async updateBankAccount(userBankAccount: BankAccount, token: string): Promise<AxiosResponse<unknown, unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            return (await this.axiosComponent.put('/bank-account/update', userBankAccount, { headers }));
        } catch (error) {
            throw new Error('Error while updating bank account: ' + error);
        }
    }

    async deleteBankAccount(userBankAccountId: number, token: string): Promise<AxiosResponse<unknown, unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            return (await this.axiosComponent.delete('/bank-account/delete/' + userBankAccountId, { headers }));
        } catch (error) {
            throw new Error('Error while deleting bank account: ' + error);
        }
    }
}