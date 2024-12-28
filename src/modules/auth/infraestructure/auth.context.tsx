import React from "react";
import GetUserAuthorizationService from "../services/get-user-authorization.service";

export const AuthContext = React.createContext({
    getUserAuthorization: new GetUserAuthorizationService()
});