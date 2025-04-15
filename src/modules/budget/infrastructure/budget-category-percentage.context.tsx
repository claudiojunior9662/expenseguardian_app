import React from "react";
import CreateBudgetCategoryPercentageService from "../services/create-budget-category-percentage.service";
import DeleteBudgetCategoryPercentageService from "../services/delete-budget-category-percentage.service";
import UpdateBudgetCategoryPercentageService from "../services/update-budget-category-percentage.service";
import ListBudgetCategoryPercentagesService from "../services/list-budget-category-percentages.service";

export const BudgetCategoryPercentageContext = React.createContext({
    createBudgetCategoryPercentage: new CreateBudgetCategoryPercentageService(),
    deleteBudgetCategoryPercentage: new DeleteBudgetCategoryPercentageService(),
    listBudgetCategories: new ListBudgetCategoryPercentagesService(),
    updateBudgetCategoryPercentage: new UpdateBudgetCategoryPercentageService()
});