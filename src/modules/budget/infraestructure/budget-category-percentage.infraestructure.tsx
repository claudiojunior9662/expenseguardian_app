import axios, { AxiosResponse } from "axios";
import { BudgetCategoryPercentage } from "../entities/budget-category-percentage.entity";

export default class BudgetCategoryPercentageInfraestructure {

    private readonly axiosComponent = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
    });

    async createBudgetCategoryPercentage(userBudgetCategoryPercentage: BudgetCategoryPercentage, token: string): Promise<AxiosResponse<unknown, unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }
    
            return (await this.axiosComponent.post('/budget/create-category-percentage', userBudgetCategoryPercentage, { headers }));
        } catch (error) {
            throw new Error('Error while creating budget category percentage: ' + error);
        }
    }

    async listBudgetCategoryPercentages(budgetId: number, token: string): Promise<AxiosResponse<BudgetCategoryPercentage[], unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            return (await this.axiosComponent.get('/budget/list-category-percentage/' + budgetId, { headers }));
        } catch (error) {
            throw new Error('Error while listing budget category percentage: ' + error);
        }
    }

    async updateBudgetCategoryPercentage(userBudgetCategoryPercentage: BudgetCategoryPercentage, token: string): Promise<AxiosResponse<unknown, unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            return (await this.axiosComponent.put('/budget/update-category-percentage', userBudgetCategoryPercentage, { headers }));
        } catch (error) {
            throw new Error('Error while updating budget category percentage: ' + error);
        }
    }

    async deleteBudgetCategoryPercentage(userBudgetCategoryPercentageId: number, token: string): Promise<AxiosResponse<unknown, unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            return (await this.axiosComponent.delete('/budget/delete-category-percentage/' + userBudgetCategoryPercentageId, { headers }));
        } catch (error) {
            throw new Error('Error while deleting budget category percentage: ' + error);
        }
    }
}