import { ButtonVariant, ButtonSize } from "./types";

export const mapButtonVariantStyle: Record<ButtonVariant, string> = {
  primary: "bg-blue-500 text-white border-transparent hover:bg-blue-500/80",
  secondary: "bg-transparent border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white",
  danger: "bg-red-700 text-white border-transparent hover:bg-red-700/80",
  ghost: "bg-gray-600 text-white border-transparent hover:bg-gray-600/80"
};

export const mapButtonSize: Record<ButtonSize, string> = {
  xs: "px-3 text-xs",
  md: "h-8 px-4 py-2 text-[13px]",
  lg: "px-4 py-1 text-lg"
};
