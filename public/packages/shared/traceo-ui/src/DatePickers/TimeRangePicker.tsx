import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Button, FieldLabel, Input, Popover } from "../index";
import dayjs from "dayjs";
import styled from "styled-components";
import { ReactCalendarBody } from "./ReactCalendarBody";
import { BasePlacement } from "@popperjs/core/lib";
import { useMemo } from "react";

interface Props {
  value: [number, number];
  onChange: (from: number, to: number) => void;
  submit?: () => void;
  placement?: BasePlacement;
}
export const TimeRangePicker = ({
  value,
  onChange,
  submit,
  placement = "bottom",
}: Props) => {
  const handleOnRangeChange = (range: [Date, Date]) => {
    /**
     * Add validation
     */
    onChange(dayjs(range[0]).unix(), dayjs(range[1]).unix());
  };

  const handleOnSubmit = () => {
    //TODO: hide popover on submit
    submit();
  };

  const popoverContent = (
    <PickerWrapper>
      <div className="w-full p-3 border-bottom">
        <span>
          <ClockCircleOutlined className="pr-2" />
          Select time range
        </span>
      </div>
      <div className="p-3">
        <div className="flex flex-row gap-x-5 mt-5 px-3">
          <FieldLabel label="From">
            <Input
              value={dayjs.unix(value[0]).format("DD-MM-YYYY HH:mm")}
              suffix={<CalendarOutlined />}
            />
          </FieldLabel>
          <FieldLabel label="To">
            <Input
              value={dayjs.unix(value[1]).format("DD-MM-YYYY HH:mm")}
              suffix={<CalendarOutlined />}
            />
          </FieldLabel>
        </div>
        <ReactCalendarBody
          value={[value[0], value[1]]}
          onChange={handleOnRangeChange}
          range={true}
        />
      </div>
      {submit && (
        <PickerFooter>
          <div className="w-full text-end">
            <Button size="xs" onClick={handleOnSubmit}>
              Submit
            </Button>
          </div>
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
    <Popover
      overrideStyles={{ transitionDuration: 0 }}
      placement={placement}
      content={popoverContent}
    >
      <Input
        style={{ minWidth: "230px" }}
        prefix={<ClockCircleOutlined />}
        value={inputValue}
      />
    </Popover>
  );
};

const PickerWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const PickerFooter = styled.div`
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  justify-content: flex-end;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-top: 1px solid var(--color-bg-secondary);
`;
