import { forwardRef, HTMLProps } from "react";
import { conditionClass, joinClasses } from "core/utils/classes";

interface SwitchProps extends Omit<HTMLProps<HTMLInputElement>, "value"> {
  value?: boolean;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ value, ...restProps }, ref) => {
    return (
      <>
        <input
          ref={ref}
          checked={value}
          className="react-switch-checkbox"
          id="react-switch-new"
          type="checkbox"
          {...restProps}
        />
        <label
          className={joinClasses(
            "react-switch-label",
            conditionClass(!!value, "bg-blue-500")
          )}
          htmlFor="react-switch-new"
        >
          <span className="react-switch-button" />
        </label>
        <style>{`
          .react-switch-checkbox {
            height: 0;
            width: 0;
            visibility: hidden;
          }
          
          .react-switch-label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            width: 40px;
            height: 20px;
            background: grey;
            border-radius: 40px;
            position: relative;
            transition: background-color .1s;
          }
          
          .react-switch-label .react-switch-button {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 16px;
            height: 16px;
            border-radius: 16px;
            transition: 0.2s;
            background: #fff;
            box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);
          }
          
          .react-switch-checkbox:checked + .react-switch-label .react-switch-button {
            left: calc(100% - 2px);
            transform: translateX(-100%);
          }
          
          .react-switch-label:active .react-switch-button {
            width: 20px;
          }
        `}</style>
      </>
    );
  }
);

Switch.displayName = "Switch";
