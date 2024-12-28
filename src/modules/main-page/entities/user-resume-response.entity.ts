export interface UserResumeResponse {
    initialDate: Date;
    finalDate: Date;
    spents: UserResumeResponseSpents[];
    incomes: UserResumeResponseIncomes[];
    outcomes: UserResumeResponseOutcomes[];
    investments: UserResumeResponseInvestments[];
    totalIncomes: number;
    totalOutcomes: number;
    available: number;
}

export interface UserResumeResponseSpents {
    description: string;
    percentage: number;
}

export interface UserResumeResponseIncomes {
    month: number;
    year: number;
    value: number;
}

export interface UserResumeResponseOutcomes {
    month: number;
    year: number;
    value: number;
}

export interface UserResumeResponseInvestments {
    description: string;
    percentage: number;
}