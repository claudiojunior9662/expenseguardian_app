import InvestmentCategoryInfraestructure from "../infraestructure/investment-category.infraestructure";

export default class DeleteInvestmentCategoryService {
    async execute(userInvestmentCategoryId: number, token: string) {
        const provider = new InvestmentCategoryInfraestructure();
        return (await provider.deleteInvestmentCategory(userInvestmentCategoryId, token));
    }
}