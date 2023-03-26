// utils

export const flatObject = (obj = {}) => Object.keys(obj || {}).reduce((acc, cur) => {
    if (typeof obj[cur] === 'object') {
        acc = { ...acc, ...flatObject(obj[cur]) }
    } else { acc[cur] = obj[cur] }
    return acc
}, {})
