import React from "react";
import CreateSpentService from "../services/create-spent.service";
import DeleteSpentService from "../services/delete-spent.service";
import UpdateSpentService from "../services/update-spent.service";
import ListSpentsByPeriodService from "../services/list-spents-by-period.service";

export const SpentContext = React.createContext({
    createSpent: new CreateSpentService(),
    deleteSpent: new DeleteSpentService(),
    listSpentsByPeriod: new ListSpentsByPeriodService(),
    updateSpent: new UpdateSpentService()
});