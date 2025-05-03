import axios, { AxiosResponse } from "axios";
import { Card } from "../entities/card.entity";

export default class CardInfrastructure {

    private readonly axiosComponent = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
    });

    async createCard(card: Card, token: string): Promise<AxiosResponse<unknown, unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }
    
            return (await this.axiosComponent.post('/card/create', card, { headers }));
        } catch (error) {
            throw new Error('Error while creating card : ' + error);
        }
    }

    async listCards(userId: number, token: string): Promise<AxiosResponse<Card[], unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            return (await this.axiosComponent.get('/card/list/' + userId, { headers }));
        } catch (error) {
            throw new Error('Error while listing cards: ' + error);
        }
    }

    async updateCard(userCard: Card, token: string): Promise<AxiosResponse<unknown, unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            return (await this.axiosComponent.put('/card/update', userCard, { headers }));
        } catch (error) {
            throw new Error('Error while updating card: ' + error);
        }
    }

    async deleteCard(userCardId: number, token: string): Promise<AxiosResponse<unknown, unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            return (await this.axiosComponent.delete('/card/delete/' + userCardId, { headers }));
        } catch (error) {
            throw new Error('Error while deleting card: ' + error);
        }
    }
}