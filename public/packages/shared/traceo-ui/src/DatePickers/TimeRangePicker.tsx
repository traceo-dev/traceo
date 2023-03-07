import { ClockCircleOutlined } from "@ant-design/icons";
import { Alert, Button, FieldLabel, Input } from "../index";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { CalendarDatesType, ReactCalendarBody } from "./ReactCalendarBody";
import dayjs, { ManipulateType } from "dayjs";
import { conditionClass, joinClasses } from "../utils/classes";
import { PickerWrapper, PickerFooter, TimeWrapper, Header } from "./styles";
import { PickerInput } from "./PickerInput";

export type RelativeTimeOption = {
  label: string;
  value: number;
  unit: ManipulateType;
  onClick?: () => void;
};

interface Props {
  value: [number, number];
  submit?: (val: [number, number]) => void;
  onClickRelativeTime?: (val: number, unit: ManipulateType) => void;
  options?: RelativeTimeOption[];
  // The longest time period (in hours) available between from and to
  maxTimePeriod?: number;
  disabled?: boolean;
}

const parseUnixToDate = (unix: number) => new Date(unix * 1e3);

export const TimeRangePicker = ({
  submit,
  value = null,
  options = [],
  maxTimePeriod = 3,
  disabled = false,
  onClickRelativeTime
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>(null);
  const [selectedValue, setSelectedValue] = useState<[number, number]>(value);

  const hasOptions = options.length > 0;

  const calendarValue = parseUnixToDate(selectedValue[0]);

  const handleOnSubmit = () => {
    submit([selectedValue[0], selectedValue[1]]);
    setOpen(false);
  };

  const handleOnChangeCalendar = (date: CalendarDatesType) => {
    const newDate = dayjs(date as Date);

    const dayJsTime = newDate.set("hour", dayjs().hour()).set("minute", dayjs().minute());

    // Current time minus 30min with date selected from calendar
    const from = dayJsTime.subtract(30, "minute").unix();

    // Current time with date selected from calendar
    const to = dayJsTime.unix();

    setSelectedValue([from, to]);
  };

  const handleOnChangeTimeFrom = (time: string) => {
    const date = parseTime(time, selectedValue[1]);
    setSelectedValue([date.unix(), selectedValue[1]]);
  };

  const handleOnChangeTimeTo = (time: string) => {
    const date = parseTime(time, selectedValue[1]);
    setSelectedValue([selectedValue[0], date.unix()]);
  };

  const parseTime = (time: string, initialDate: number) => {
    // time returned in HH:mm format
    const [hour, minute] = time.split(":");

    const dayJS = dayjs.unix(initialDate);
    const date = dayJS.set("hour", parseInt(hour)).set("minute", parseInt(minute));

    return date;
  };

  useEffect(() => {
    const from = dayjs.unix(selectedValue[0]);
    const to = dayjs.unix(selectedValue[1]);

    const isIncorrectDiff = Math.abs(from.diff(to, "hour")) > maxTimePeriod;
    const isFromAfterTo = from.isAfter(to);
    const isToBeforeFrom = to.isBefore(from);

    if (isIncorrectDiff) {
      setError(`Data can only be loaded from ${maxTimePeriod}h range`);
    }

    if (isFromAfterTo) {
      setError("'From' can't be after 'To'");
    }

    if (isToBeforeFrom) {
      setError("'To' can't be before 'From'");
    }

    if (!isIncorrectDiff && !isFromAfterTo && !isToBeforeFrom) {
      setError(null);
    }
  }, [selectedValue]);

  const handleOnClickOption = (value: number, unit: ManipulateType) => {
    onClickRelativeTime(value, unit);
    setOpen(false);
  };

  const relativeTimeContainer = (
    <RelativeTimeWrapper>
      <span className="px-3 py-2">Relative time</span>
      <ul className="pl-0 list-none">
        {options?.map(({ label, unit, value }, index) => (
          <RelativeTimeOption key={index} onClick={() => handleOnClickOption(value, unit)}>
            {label}
          </RelativeTimeOption>
        ))}
      </ul>
    </RelativeTimeWrapper>
  );

  const popoverContent = (
    <PickerWrapper>
      <Header>
        <span>
          <ClockCircleOutlined className="pr-2" />
          Select time range
        </span>
      </Header>
      <div className="flex flex-row grid grid-cols-12">
        {hasOptions && relativeTimeContainer}
        <div
          className={joinClasses("p-3", conditionClass(hasOptions, "col-span-8", "col-span-12"))}
        >
          <ReactCalendarBody
            className="p-3"
            width={296}
            value={calendarValue}
            onChange={(date) => handleOnChangeCalendar(date)}
          />
          <TimeWrapper>
            <FieldLabel labelSize="xs" label="Time from" className="w-full">
              <Input
                type="time"
                value={dayjs.unix(selectedValue[0]).format("HH:mm")}
                onChange={(e) => handleOnChangeTimeFrom(e.currentTarget.value)}
              />
            </FieldLabel>
            <FieldLabel labelSize="xs" label="Time to" className="w-full">
              <Input
                type="time"
                value={dayjs.unix(selectedValue[1]).format("HH:mm")}
                onChange={(e) => handleOnChangeTimeTo(e.currentTarget.value)}
              />
            </FieldLabel>
          </TimeWrapper>
          {error && <Alert type="error" message={error} />}
        </div>
      </div>
      {submit && (
        <PickerFooter>
          <div className="w-full text-end">
            <Button disabled={!!error} size="xs" onClick={handleOnSubmit}>
              Submit
            </Button>
          </div>
        </PickerFooter>
      )}
    </PickerWrapper>
  );

  const inputValue = useMemo(() => {
    const from = dayjs.unix(value[0]).format("DD MMM, HH:mm");
    const to = dayjs.unix(value[1]).format("HH:mm");

    return `${from} - ${to}`;
  }, value);

  return (
    <PickerInput
      open={open}
      popoverContent={popoverContent}
      value={inputValue}
      onClick={() => setOpen(true)}
      disabled={disabled}
    />
  );
};

const RelativeTimeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--color-bg-secondary);
  width: 10rem; /* 160px */
  grid-column: span 4 / span 4;
`;

const RelativeTimeOption = styled.li`
  cursor: pointer;
  padding-left: 0.75rem; /* 12px */
  padding-right: 0.75rem; /* 12px */
  padding-top: 0.5rem; /* 8px */
  padding-bottom: 0.5rem; /* 8px */

  &:hover {
    background-color: var(--color-bg-secondary);
  }
`;
