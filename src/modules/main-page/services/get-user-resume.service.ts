import { UserResumeRequest } from "../entities/user-resume-request.entity";
import MainPageInfraestructure from "../infraestructure/main-page.infraestructure";

export default class GetUserResumeService {
    async execute(userResumeRequest: UserResumeRequest, token: string) {
        const provider = new MainPageInfraestructure();
        return (await provider.getUserResume(userResumeRequest, token));
    }
}