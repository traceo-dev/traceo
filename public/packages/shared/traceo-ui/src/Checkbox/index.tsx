import { forwardRef, HTMLProps } from "react";

interface CheckboxProps extends Omit<HTMLProps<HTMLInputElement>, "value"> {
  value?: boolean;
}
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ value, ...restProps }, ref) => {
    return (
      <>
        <input {...restProps} checked={value} ref={ref} type="checkbox" />
        <style>{`
          input[type=checkbox] {
            position: relative;
            cursor: pointer;
          }

          input[type=checkbox]:before {
            content: "";
            position: absolute;
            width: 16px;
            height: 16px;
            top: 0;
            left: 0;
            border: 1px solid #434343;
            border-radius: 3px;
            padding: 1px;
            background-color: var(--color-bg-primary);
          }

          input[type=checkbox]:checked:before {
            background-color: #177ddc;
            border-color: #177ddc;
          }

          input[type=checkbox]:checked:after {
            content: "";
            display: block;
            width: 5px;
            height: 10px;
            border: solid white;
            border-width: 0 2px 2px 0;
            -webkit-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
            position: absolute;
            top: 2px;
            left: 6px;
          }
        `}</style>
      </>
    );
  }
);

Checkbox.displayName = "Checkbox";
