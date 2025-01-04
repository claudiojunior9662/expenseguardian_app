import axios, { AxiosResponse } from "axios";
import { InvestmentCategory } from "../entities/investment-category.entity";

export default class InvestmentCategoryInfraestructure {

    private readonly axiosComponent = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
    });

    async createInvestmentCategory(userInvestmentCategory: InvestmentCategory, token: string): Promise<AxiosResponse<unknown, unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }
    
            return (await this.axiosComponent.post('/investment-category/create', userInvestmentCategory, { headers }));
        } catch (error) {
            throw new Error('Error while creating investment category: ' + error);
        }
    }

    async listInvestmentCategories(userId: number, token: string): Promise<AxiosResponse<InvestmentCategory[], unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            return (await this.axiosComponent.get('/investment-category/list/' + userId, { headers }));
        } catch (error) {
            throw new Error('Error while listing investment categories: ' + error);
        }
    }

    async updateInvestmentCategory(userInvestmentCategory: InvestmentCategory, token: string): Promise<AxiosResponse<unknown, unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            return (await this.axiosComponent.put('/investment-category/update', userInvestmentCategory, { headers }));
        } catch (error) {
            throw new Error('Error while updating investment category: ' + error);
        }
    }

    async deleteInvestmentCategory(userInvestmentCategoryId: number, token: string): Promise<AxiosResponse<unknown, unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            return (await this.axiosComponent.delete('/investment-category/delete/' + userInvestmentCategoryId, { headers }));
        } catch (error) {
            throw new Error('Error while deleting investment category: ' + error);
        }
    }
}