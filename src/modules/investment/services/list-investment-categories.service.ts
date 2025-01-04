import InvestmentCategoryInfraestructure from "../infraestructure/investment-category.infraestructure";

export default class ListInvestmentCategoriesService {
    async execute(userId: number, token: string) {
        const provider = new InvestmentCategoryInfraestructure();
        return (await provider.listInvestmentCategories(userId, token));
    }
}