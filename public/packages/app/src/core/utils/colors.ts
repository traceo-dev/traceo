export const randomHexColor = () => {
    const c = Math.floor(Math.random() * 16777215).toString(16);
    return `#${c}`;
};

/**
 * @returns value in rgba(x,x,x,x) format
 */
export const calculateOpacity = (hex: string, opacity: number): string => {
    const sanitizedHex = hex.replace("#", "");
    const decimalValue = parseInt(sanitizedHex, 16);
    const alpha = opacity / 100;

    const red = (decimalValue >> 16) & 255;
    const green = (decimalValue >> 8) & 255;
    const blue = decimalValue & 255;

    const rgba = `rgba(${red},${green},${blue},${alpha})`;

    return rgba;
}
