import { forwardRef, HTMLProps, useMemo } from "react";
import { conditionClass, joinClasses } from "../utils/classes";

interface SwitchProps extends Omit<HTMLProps<HTMLInputElement>, "value"> {
  value?: boolean;
}

const generateRandomId = (prefix: string) => {
  const hash = Math.random().toString(36).substr(2, 10);
  return prefix + "_" + hash;
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ value, id, ...restProps }, ref) => {
    const switchId = useMemo(() => {
      return !id ? generateRandomId("switch") : id;
    }, [id]);

    return (
      <>
        <input
          type="checkbox"
          checked={value}
          className="traceo-switch-checkbox"
          id={switchId}
          {...restProps}
          ref={ref}
        />
        <label
          className={joinClasses(
            "traceo-switch-label",
            conditionClass(!!value, "bg-blue-500")
          )}
          htmlFor={switchId}
        >
          <span className="traceo-switch-button" />
        </label>
        <style>{`
          .traceo-switch-checkbox {
            height: 0;
            width: 0;
            visibility: hidden;
          }
          
          .traceo-switch-label {
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
          
          .traceo-switch-label .traceo-switch-button {
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
          
          .traceo-switch-checkbox:checked + .traceo-switch-label .traceo-switch-button {
            left: calc(100% - 2px);
            transform: translateX(-100%);
          }
          
          .traceo-switch-label:active .traceo-switch-button {
            width: 20px;
          }
        `}</style>
      </>
    );
  }
);

Switch.displayName = "Switch";
