enum CardTypeEnum {
    DEBIT = 1,
    CREDIT = 2
}

export function getCardTypeValues(): string[] {
    return Object.values(CardTypeEnum).filter((value) => typeof value === "string") as string[];
}


export default CardTypeEnum;