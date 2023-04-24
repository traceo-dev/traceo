import { ClockCircleOutlined } from "@ant-design/icons";
import { Popover } from "../Popover";
import { Input } from "../Input";
import { parseDateTime, parseInputValue } from "./utils";

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
  disabled = false,
  range = false
}: Props) => {
  const parseInput = () => {
    if (value) return parseDateTime(value);
    if (values) return parseInputValue(values, range);
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
      <Input
        style={{ minWidth: range ? "320px" : "250px", cursor: "pointer" }}
        prefix={<ClockCircleOutlined />}
        readOnly
        disabled={disabled}
        value={parseInput()}
        onClick={onClick}
      />
    </Popover>
  );
};
