import { ClockCircleOutlined } from "@ant-design/icons";
import { Popover } from "../Popover";
import { Input } from "../Input";

interface Props {
  value: string;
  onClick: () => void;
  open: boolean;
  popoverContent: JSX.Element;
  disabled: boolean;
}
export const PickerInput = ({ popoverContent, onClick, open, value, disabled }: Props) => {
  return (
    <Popover
      disabled={disabled}
      open={open}
      overrideStyles={{ transitionDuration: 0 }}
      placement="bottom"
      content={popoverContent}
    >
      <Input
        style={{ minWidth: "230px", cursor: "pointer" }}
        prefix={<ClockCircleOutlined />}
        readOnly
        disabled={disabled}
        value={value}
        onClick={onClick}
      />
    </Popover>
  );
};
