import axios, { AxiosResponse } from "axios";
import { Spent } from "../entities/spent.entity";
import { format } from 'date-fns';

export default class SpentInfrastructure {

    private readonly axiosComponent = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
    });

    async createSpent(spent: Spent, token: string): Promise<AxiosResponse<unknown, unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }
    
            return (await this.axiosComponent.post('/spent/create', spent, { headers }));
        } catch (error) {
            throw new Error('Error while creating spent : ' + (error instanceof Error ? error.message : String(error)));
        }
    }

    async listSpentsByPeriod(userId: number, initialDate: Date, finalDate: Date, token: string): Promise<AxiosResponse<Spent[], unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            return (await this.axiosComponent.get(`/spent/list-by-period/${userId}/${format(initialDate, 'yyyy-MM-dd')}/${format(finalDate, 'yyyy-MM-dd')}`, { headers }));
        } catch (error) {
            throw new Error('Error while listing spents by period: ' + error);
        }
    }

    async updateSpent(userSpent: Spent, token: string): Promise<AxiosResponse<unknown, unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            return (await this.axiosComponent.put('/spent/update', userSpent, { headers }));
        } catch (error) {
            throw new Error('Error while updating spent: ' + error);
        }
    }

    async deleteSpent(userSpentId: number, token: string): Promise<AxiosResponse<unknown, unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            return (await this.axiosComponent.delete('/spent/delete/' + userSpentId, { headers }));
        } catch (error) {
            throw new Error('Error while deleting spent: ' + error);
        }
    }
}