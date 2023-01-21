/**
 * Function to get value by object traversing
 */
export const getTraversValue = (obj: any, path: string) => {
    if (!path) {
        return null;
    }
    const pathArray = path.split(".");
    let current = obj;
    for (const segment of pathArray) {
        if (current[segment] === undefined) {
            return undefined;
        }
        current = current[segment];
    }
    return current;
};
