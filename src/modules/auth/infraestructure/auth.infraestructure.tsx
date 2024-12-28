import axios, { AxiosResponse } from "axios";
import { UserAuthorizationRequest } from "../entities/user-authorization-request.entity";
import { UserAuthorizationResponse } from "../entities/user-authorization-response.entity";

export default class AuthInfraestructure {

    private readonly axiosComponent = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    });

    async getUserAuthorization(userAuthorizationRequest: UserAuthorizationRequest): Promise<AxiosResponse<UserAuthorizationResponse, unknown>> {
        try {
            return (await this.axiosComponent.post('/user/auth', userAuthorizationRequest));
        } catch (error) {
            throw new Error('Error while getting user authorization token: ' + error);
        }   
    }
}