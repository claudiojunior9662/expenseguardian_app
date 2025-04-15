import React from "react";
import CreateBudgetService from "../services/create-budget.service";
import DeleteBudgetService from "../services/delete-budget.service";
import UpdateBudgetService from "../services/update-budget.service";
import ListBudgetsService from "../services/list-budgets.service";

export const BudgetContext = React.createContext({
    createBudget: new CreateBudgetService(),
    deleteBudget: new DeleteBudgetService(),
    listBudgets: new ListBudgetsService(),
    updateBudget: new UpdateBudgetService()
});