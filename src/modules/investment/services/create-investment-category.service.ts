import { InvestmentCategory } from "../entities/investment-category.entity";
import InvestmentCategoryInfraestructure from "../infraestructure/investment-category.infraestructure";

export default class CreateInvestmentCategoryService {
    async execute(userInvestmentCategory: InvestmentCategory, token: string) {
        const provider = new InvestmentCategoryInfraestructure();
        return (await provider.createInvestmentCategory(userInvestmentCategory, token));
    }
}