import { Button, FieldLabel, Input, Popover } from "../index";
import { CalendarDatesType, ReactCalendarBody } from "./ReactCalendarBody";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { BasePlacement } from "@popperjs/core/lib";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { Header, PickerFooter, PickerWrapper, TimeWrapper } from "./styles";
import { PickerInput } from "./PickerInput";

interface Props {
  value: [number, number];
  onChange: (from: number, to: number) => void;
  submit?: () => void;
  placement?: BasePlacement;
  disabled?: boolean;
}
export const DatesRangePicker = ({ value, onChange, submit, disabled = false }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOnRangeChange = (range: CalendarDatesType) => {
    /**
     * Add validation
     */
    onChange(dayjs(range[0]).unix(), dayjs(range[1]).unix());
  };

  const handleOnSubmit = () => {
    submit();
    setOpen(false);
  };

  const parseUnixToDate = (unix: number) => new Date(unix * 1e3);
  const rangeValue = useMemo(() => [parseUnixToDate(value[0]), parseUnixToDate(value[1])], value);

  const popoverContent = (
    <PickerWrapper>
      <Header>
        <span>
          <ClockCircleOutlined className="pr-2" />
          Select dates range
        </span>
      </Header>
      <div className="p-3">
        <TimeWrapper>
          <FieldLabel label="From">
            <Input
              value={dayjs.unix(value[0]).format("DD-MM-YYYY HH:mm")}
              readOnly
              suffix={<CalendarOutlined />}
            />
          </FieldLabel>
          <FieldLabel label="To">
            <Input
              value={dayjs.unix(value[1]).format("DD-MM-YYYY HH:mm")}
              readOnly
              suffix={<CalendarOutlined />}
            />
          </FieldLabel>
        </TimeWrapper>
        <ReactCalendarBody value={rangeValue} onChange={handleOnRangeChange} range={true} />
      </div>
      {submit && (
        <PickerFooter>
          <Button size="xs" onClick={handleOnSubmit}>
            Submit
          </Button>
        </PickerFooter>
      )}
    </PickerWrapper>
  );

  const inputValue = useMemo(() => {
    const from = dayjs.unix(value[0]).format("DD MMM, YYYY");
    const to = dayjs.unix(value[1]).format("DD MMM, YYYY");

    return `${from} - ${to}`;
  }, value);

  return (
    <PickerInput
      open={open}
      popoverContent={popoverContent}
      value={inputValue}
      onClick={() => !disabled && setOpen(true)}
      disabled={disabled}
    />
  );
};
