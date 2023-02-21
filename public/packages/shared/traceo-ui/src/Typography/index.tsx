import { joinClasses } from "../utils/classes";
import { forwardRef, HTMLProps } from "react";

type FontSizeType = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";
type FontWeightType =
  | "thin"
  | "extralight"
  | "light"
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black";

interface TypographyProps extends Omit<HTMLProps<HTMLLabelElement>, "size"> {
  size?: FontSizeType;
  weight?: FontWeightType;
}

const mapTypographyFontSize: Record<FontSizeType, string> = {
  xxs: "text-2xs",
  xs: "text-xs",
  sm: "text-sm",
  md: "text-sm",
  lg: "text-lg",
  xl: "text-xl",
  xxl: "text-2xl",
  xxxl: "text-5xl"
};

export const Typography = forwardRef<HTMLLabelElement, TypographyProps>(
  ({ children, className = "", size = "md", weight = "normal", ...restProps }, ref) => {
    const fontSize = mapTypographyFontSize[size];
    const fontWeight = `font-${weight}`;

    return (
      <span
        ref={ref}
        className={joinClasses("leading-5 text-primary", fontWeight, fontSize, className)}
        {...restProps}
      >
        {children}
      </span>
    );
  }
);

Typography.displayName = "Typography";
