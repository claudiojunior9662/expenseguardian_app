import React from "react";
import CreateBudgetCategoryService from "../services/create-budget-category.service";
import DeleteBudgetCategoryService from "../services/delete-budget-category.service";
import ListBudgetCategoriesService from "../services/list-budget-categories.service";
import UpdateBudgetCategoryService from "../services/update-budget-category.service";

export const BudgetCategoryContext = React.createContext({
    createBudgetCategory: new CreateBudgetCategoryService(),
    deleteBudgetCategory: new DeleteBudgetCategoryService(),
    listBudgetCategories: new ListBudgetCategoriesService(),
    updateBudgetCategory: new UpdateBudgetCategoryService()
});