import React from "react";
import GetUserResumeService from "../services/get-user-resume.service";

export const MainPageContext = React.createContext({
    getUserResume: new GetUserResumeService()
});