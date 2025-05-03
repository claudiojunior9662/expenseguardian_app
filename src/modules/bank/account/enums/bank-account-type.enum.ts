enum BankAccountTypeEnum {
    CURRENT = 1,
    SAVINGS = 2,
    OTHERS = 3
}

export function getBankAccountTypeValues(): string[] {
    return Object.values(BankAccountTypeEnum).filter((value) => typeof value === "string") as string[];
}


export default BankAccountTypeEnum;