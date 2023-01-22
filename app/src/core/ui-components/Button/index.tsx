import { LoadingOutlined } from "@ant-design/icons";
import { conditionClass, joinClasses } from "core/utils/classes";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { mapButtonVariantStyle, mapButtonSize } from "./styles";
import { ButtonVariant, ButtonSize } from "./types";

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  variant?: ButtonVariant;
  icon?: JSX.Element;
  loading?: boolean;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const {
    variant = "primary",
    icon,
    loading,
    size = "md",
    children,
    className,
    disabled,
    ...restProps
  } = props;

  const buttonVariantStyle = mapButtonVariantStyle[variant];
  const buttonSizeStyle = mapButtonSize[size];

  const classNames = joinClasses(
    "max-w-min relative flex inline-flex border-2 items-center font-semibold text-white whitespace-nowrap text-center cursor-pointer transition-all duration-300 ease-in-out rounded-sm border-solid",
    buttonVariantStyle,
    buttonSizeStyle,
    conditionClass(disabled, "opacity-50 cursor-not-allowed"),
    className
  );

  return (
    <button className={classNames} disabled={disabled} ref={ref} {...restProps}>
      <div className="flex flex-row items-center space-nowrap h-full">
        {(icon || loading) && (
          <div className="pr-2">
            {loading && <LoadingOutlined />}
            {icon && !loading && icon}
          </div>
        )}

        {children}
      </div>
    </button>
  );
});

Button.displayName = "Button";
