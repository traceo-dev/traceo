import { joinClasses } from "core/utils/classes";
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

const handleTypographyFontSize: Record<FontSizeType, string> = {
  xxs: "text-2xs",
  xs: "text-xs",
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
  xl: "text-xl",
  xxl: "text-2xl",
  xxxl: "text-5xl"
};

export const Typography = forwardRef<HTMLLabelElement, TypographyProps>(
  ({ children, className, size = "md", weight = "normal", ...restProps }, ref) => {
    const fontSize = handleTypographyFontSize[size];
    const fontWeight = `font-${weight}`;

    return (
      <label
        ref={ref}
        className={joinClasses("leading-5", fontWeight, fontSize, className)}
        {...restProps}
      >
        {children}
      </label>
    );
  }
);

Typography.displayName = "Typography";
