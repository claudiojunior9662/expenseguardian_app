import React from "react";
import CreateInvestmentCategoryService from "../services/create-investment-category.service";
import DeleteInvestmentCategoryService from "../services/delete-investment-category.service";
import ListInvestmentCategoriesService from "../services/list-investment-categories.service";
import UpdateInvestmentCategoryService from "../services/update-investment-category.service";

export const InvestmentCategoryContext = React.createContext({
    createInvestmentCategory: new CreateInvestmentCategoryService(),
    deleteInvestmentCategory: new DeleteInvestmentCategoryService(),
    listInvestmentCategories: new ListInvestmentCategoriesService(),
    updateInvestmentCategory: new UpdateInvestmentCategoryService()
});