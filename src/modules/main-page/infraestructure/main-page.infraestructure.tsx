import axios, { AxiosResponse } from "axios";
import { UserResumeRequest } from "../entities/user-resume-request.entity";
import { UserResumeResponse } from "../entities/user-resume-response.entity";

export default class MainPageInfraestructure {

    private readonly axiosComponent = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
    });


    async getUserResume(userResumeRequest: UserResumeRequest, token: string): Promise<AxiosResponse<UserResumeResponse, unknown>> {
        try {
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            return (await this.axiosComponent.post('/user/resume', userResumeRequest, { headers }));
        } catch (error) {
            throw new Error('Error while getting user resume information: ' + error);
        }   
    }


}