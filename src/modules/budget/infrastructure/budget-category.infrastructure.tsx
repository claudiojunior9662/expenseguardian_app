import axios, { AxiosResponse } from "axios";
import { BudgetCategory } from "../entities/budget-category.entity";

export default class BudgetCategoryInfrastructure {

    private readonly axiosComponent = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
    });

    async createBudgetCategory(userBudgetCategory: BudgetCategory, token: string): Promise<AxiosResponse<unknown, unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }
    
            return (await this.axiosComponent.post('/budget/create-category', userBudgetCategory, { headers }));
        } catch (error) {
            throw new Error('Error while creating budget category: ' + error);
        }
    }

    async listBudgetCategories(userId: number, token: string): Promise<AxiosResponse<BudgetCategory[], unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            return (await this.axiosComponent.get('/budget/list-categories/' + userId, { headers }));
        } catch (error) {
            throw new Error('Error while listing budget categories: ' + error);
        }
    }

    async updateBudgetCategory(userBudgetCategory: BudgetCategory, token: string): Promise<AxiosResponse<unknown, unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            return (await this.axiosComponent.put('/budget/update-category', userBudgetCategory, { headers }));
        } catch (error) {
            throw new Error('Error while updating budget category: ' + error);
        }
    }

    async deleteBudgetCategory(userBudgetCategoryId: number, token: string): Promise<AxiosResponse<unknown, unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            return (await this.axiosComponent.delete('/budget/delete-category/' + userBudgetCategoryId, { headers }));
        } catch (error) {
            throw new Error('Error while deleting budget category: ' + error);
        }
    }
}