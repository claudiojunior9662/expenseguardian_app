enum SpentTypeEnum {
    CURRENT,
    SCHEDULED,
    IN_INSTALLMENTS,
    INCOME
}

interface SpentTypeHelper {
    type: SpentTypeEnum;
    helperType: string;
    helper: string;
}

function getHelperText(type: SpentTypeEnum): string {
    switch (type) {
        case SpentTypeEnum.CURRENT:
            return "Current spent — an expense that has already occurred or was recorded immediately.";
        case SpentTypeEnum.SCHEDULED:
            return "Scheduled spent — an expense planned to happen in the future.";
        case SpentTypeEnum.IN_INSTALLMENTS:
            return "Installment spent — an expense that will be paid in multiple parts.";
        case SpentTypeEnum.INCOME:
            return "Income — a received amount, such as a salary, sale, or other earnings.";
        default:
            return "Unknown expense type.";
    }
}

export function getHelperType(type: SpentTypeEnum): string {
    switch (type) {
        case SpentTypeEnum.CURRENT:
            return "Current";
        case SpentTypeEnum.SCHEDULED:
            return "Scheduled";
        case SpentTypeEnum.IN_INSTALLMENTS:
            return "In Installments";
        case SpentTypeEnum.INCOME:
            return "Income";
        default:
            return "Unknown";
    }
}

export function getSpentTypeValues(): SpentTypeHelper[] {
    return Object.keys(SpentTypeEnum)
        .filter((key) => isNaN(Number(key)))
        .map((key) => ({
            type: SpentTypeEnum[key as keyof typeof SpentTypeEnum],
            helperType: getHelperType(SpentTypeEnum[key as keyof typeof SpentTypeEnum]),
            helper: getHelperText(SpentTypeEnum[key as keyof typeof SpentTypeEnum]),
        }));
}


export default SpentTypeEnum;