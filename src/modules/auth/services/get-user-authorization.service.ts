import { UserAuthorizationRequest } from "../entities/user-authorization-request.entity";
import AuthInfraestructure from "../infraestructure/auth.infraestructure";

export default class GetUserAuthorizationService {
    async execute(userAuthorizationRequest: UserAuthorizationRequest) {
        const provider = new AuthInfraestructure();
        return (await provider.getUserAuthorization(userAuthorizationRequest));
    }
}