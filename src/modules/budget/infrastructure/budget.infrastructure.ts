import axios, { AxiosResponse } from "axios";
import { Budget } from "../entities/budget.entity";

export default class BudgetInfrastructure {

    private readonly axiosComponent = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
    });

    async createBudget(userBudget: Budget, token: string): Promise<AxiosResponse<unknown, unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }
    
            return (await this.axiosComponent.post('/budget/create', userBudget, { headers }));
        } catch (error) {
            throw new Error('Error while creating budget : ' + error);
        }
    }

    async listBudgets(userId: number, token: string): Promise<AxiosResponse<Budget[], unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            return (await this.axiosComponent.get('/budget/list/' + userId, { headers }));
        } catch (error) {
            throw new Error('Error while listing budgets: ' + error);
        }
    }

    async updateBudget(userBudget: Budget, token: string): Promise<AxiosResponse<unknown, unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            return (await this.axiosComponent.put('/budget/update', userBudget, { headers }));
        } catch (error) {
            throw new Error('Error while updating budget: ' + error);
        }
    }

    async deleteBudget(userBudgetId: number, token: string): Promise<AxiosResponse<unknown, unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            return (await this.axiosComponent.delete('/budget/delete/' + userBudgetId, { headers }));
        } catch (error) {
            throw new Error('Error while deleting budget: ' + error);
        }
    }
}