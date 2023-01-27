const get = (item: string) => {
    return document.cookie
        .split('; ')
        .filter((i) => i.startsWith(item))
        .map((c) => c.split('=')[1])[0]
}
export const cookie = {
    get
}