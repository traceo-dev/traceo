export const randomHexColor = () => {
    const c = Math.floor(Math.random() * 16777215).toString(16);
    return `#${c}`;
};
