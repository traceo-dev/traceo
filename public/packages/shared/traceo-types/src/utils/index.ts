export const isEmpty = <T>(arr: T[] = []): boolean => {
    return arr && arr.length === 0;
}

export const isNull = <T>(val: T): boolean => {
    return val === undefined || val === null || Number.isNaN(val);
}
