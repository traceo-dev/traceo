import { ClockCircleOutlined } from "@ant-design/icons";
import { Popover } from "../Popover";
import { parseDateTime, parseInputValue } from "./utils";
import { conditionClass, joinClasses } from "../utils";

interface Props {
  value?: number;
  values?: [number, number];
  onClick: () => void;
  open: boolean;
  popoverContent: JSX.Element;
  disabled: boolean;
  range?: boolean;
}
export const TimePickerInput = ({
  popoverContent,
  onClick,
  open = false,
  value = null,
  values = null,
  disabled = false
}: Props) => {
  const parseInput = () => {
    if (value) return parseDateTime(value);
    if (values) return parseInputValue(values);
  };
  return (
    <Popover
      disabled={disabled}
      open={open}
      overrideStyles={{ transitionDuration: 0, marginTop: "10px" }}
      placement="bottom-start"
      content={popoverContent}
      showArrow={false}
    >
      <div
        onClick={onClick}
        className={joinClasses(
          "gap-x-2 rounded-sm flex flex-row cursor-pointer items-center text-[13px] py-1 pl-2 pr-5 bg-primary border border-solid border-secondary hover:ring-2 hover:ring-blue",
          conditionClass(disabled, "opacity-60 pointer-events-none")
        )}
      >
        <ClockCircleOutlined />
        <span className="whitespace-nowrap">{parseInput()}</span>
      </div>
    </Popover>
  );
};
