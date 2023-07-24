import { Alert, FieldLabel, Input, Popover } from "../index";
import { useEffect, useState, useCallback } from "react";
import { CalendarDatesType, CalendarBody } from "./CalendarBody";
import dayjs from "dayjs";
import { PickerWrapper, TimeWrapper } from "./styles";
import { parseInputValue, relativeTimeOptions, setTimeToUnix, validateInput } from "./utils";
import { CalendarFooter } from "./CalendarFooter";
import { RelativeTimeOption } from "./types";
import { ClockCircleOutlined, DownOutlined } from "@ant-design/icons";
import styled, { css } from "styled-components";

interface Props {
  value: [number, number];
  submit: (val: [number, number]) => void;
  // List of options on panel left side
  isRelativeOptions?: boolean;
  // The longest time period (in hours) available between from and to
  maxHourPeriod?: number;
  disabled?: boolean;
  // Enable checking range time between two dates in calendar
  datesRange?: boolean;
  // Min date available on calendar
  minDate?: Date;
  // Max date available on calendar
  maxDate?: Date;
  // Input type
  type?: "primary" | "secondary";
}

const MAX_DATE = new Date(dayjs().unix() * 1e3);

export const TimeRangePicker = ({
  submit,
  isRelativeOptions = true,
  value = null,
  disabled = false,
  datesRange = true,
  maxDate = MAX_DATE,
  minDate = null,
  type = "primary"
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>(null);
  const [selectedValue, setSelectedValue] = useState<[number, number]>(value);
  const [from, setFrom] = useState<string>(null);
  const [to, setTo] = useState<string>(null);
  const [selectedRelativeTime, setSelectedRelativeTime] = useState<RelativeTimeOption>(undefined);

  const setRelativeTime = () => {
    const from = dayjs.unix(selectedValue[0]);
    const to = dayjs.unix(selectedValue[1]);

    const diff = Math.abs(from.diff(to, "minutes"));
    const option = relativeTimeOptions.find((opt) => opt.value === diff) ?? undefined;

    setSelectedRelativeTime(option);
  };

  useEffect(() => {
    setRelativeTime();
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    const from = dayjs.unix(selectedValue[0]);
    const to = dayjs.unix(selectedValue[1]);

    setFrom(from.format("HH:mm"));
    setTo(to.format("HH:mm"));

    const error = validateInput(from, to);
    setError(error);
  }, [selectedValue]);

  const handleOnSubmit = () => {
    submit([selectedValue[0], selectedValue[1]]);
    setOpen(false);
  };

  const handleOnChangeCalendar = useCallback(
    (date: CalendarDatesType) => {
      if (!datesRange) {
        const dayJsTime = dayjs(date as Date)
          .set("hour", dayjs().hour())
          .set("minute", dayjs().minute());

        // Current time minus 30min with date selected from calendar
        const from = dayJsTime.subtract(30, "minute").unix();

        // Current time with date selected from calendar
        const to = dayJsTime.unix();

        setSelectedValue([from, to]);
      } else if (date[0] && date[1]) {
        // On change range on calendar time is set to 00:00-23:59
        const from = dayjs(date[0]).unix();
        const to = dayjs(date[1]).unix();
        setSelectedValue([from, to]);
      }
    },
    [selectedValue]
  );

  const handleOnChangeTimeFrom = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      e.stopPropagation();

      const time = e.currentTarget.value;
      if (time && typeof time === "string") {
        const date = setTimeToUnix(time, selectedValue[0]);
        setSelectedValue([date.unix(), selectedValue[1]]);
      }
    },
    [selectedValue]
  );

  const handleOnChangeTimeTo = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      e.stopPropagation();

      const time = e.currentTarget.value;
      if (time && typeof time === "string") {
        const date = setTimeToUnix(time, selectedValue[1]);
        setSelectedValue([selectedValue[0], date.unix()]);
      }
    },
    [selectedValue]
  );

  const onClickOption = (option: RelativeTimeOption) => {
    const { value, unit } = option;
    const from = dayjs().subtract(value, unit).unix();
    const to = dayjs().unix();

    setSelectedValue([from, to]);
    setSelectedRelativeTime(option);

    submit([from, to]);
  };

  const renderContent = () => {
    return (
      <PickerWrapper>
        <div onClick={(e) => e.stopPropagation()}>
          <CalendarBody
            className="p-3"
            width={300}
            range={true}
            values={selectedValue}
            onChange={(date) => handleOnChangeCalendar(date)}
            maxDate={maxDate}
            minDate={minDate}
          />
          <TimeWrapper>
            <FieldLabel labelSize="xs" label="From" className="w-full">
              <Input type="time" value={from} onChange={handleOnChangeTimeFrom} />
            </FieldLabel>
            <FieldLabel labelSize="xs" label="To" className="w-full">
              <Input type="time" value={to} onChange={handleOnChangeTimeTo} />
            </FieldLabel>
          </TimeWrapper>
          {error && <Alert type="error" message={error} />}
        </div>
        <CalendarFooter disabledApplyBtn={!!error} onSubmit={handleOnSubmit} />
      </PickerWrapper>
    );
  };

  const relativeOptions = () => {
    return (
      <RelativeOptionsList>
        {relativeTimeOptions.map((opt, index) => (
          <RelativeOption
            isSelected={opt === selectedRelativeTime}
            onClick={() => onClickOption(opt)}
            key={index}
          >
            <span className="pl-5">{opt.label}</span>
          </RelativeOption>
        ))}
      </RelativeOptionsList>
    );
  };

  return (
    <PickerContainer variant={type}>
      {isRelativeOptions && (
        <Popover content={relativeOptions()}>
          <RelativePicker variant={type}>
            <span className="text-xs">
              <DownOutlined />
            </span>
            <span>{selectedRelativeTime?.label ?? "Custom"}</span>
          </RelativePicker>
        </Popover>
      )}

      <Popover
        disabled={disabled}
        open={open}
        overrideStyles={{ transitionDuration: 0 }}
        placement="bottom-start"
        content={renderContent()}
      >
        <TimePicker variant={type}>
          <span className="text-xs">
            <ClockCircleOutlined />
          </span>
          <span>{parseInputValue(value)}</span>
        </TimePicker>
      </Popover>
    </PickerContainer>
  );
};

const RelativeOptionsList = styled.div`
  display: flex;
  flex-direction: column;
  margin-inline: 4px;
  overflow-y: auto;
  max-height: 160px;
`;

const RelativeOption = styled.div`
  padding: 4px;
  min-width: 160px;
  cursor: pointer;

  &:hover {
    background-color: var(--color-bg-secondary);
  }

  ${(props) =>
    props.isSelected &&
    css`
      color: var(--color-text-active);
      font-weight: 500;
    `}
`;

const PickerContainer = styled.div`
  display: flex;
  row-direction: row;
  align-items: center;

  ${(props) =>
    props.variant === "primary" &&
    css`
      &:hover {
        box-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width))
          var(--tw-ring-color);
        --tw-ring-color: rgb(96 165 250);
        border-radius: 2px;
      }
    `}
`;

const Picker = styled.div`
  column-gap: 8px;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  align-items: center;
  font-size: 12px;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-inline: 8px;
  background-color: var(--color-bg-secondary);
  whitespace: no-wrap;
  font-weight: 500;

  &:hover {
    background-color: var(--color-bg-light-secondary);
    color: #ffffff;
  }

  ${(props) =>
    props.variant === "primary" &&
    css`
      background-color: var(--color-bg-primary);
      padding-top: 4px;
      padding-bottom: 4px;
      border: 1px solid var(--color-bg-secondary);
      font-size: 13px;
      font-weight: 400;

      &:hover {
        background-color: var(--color-bg-secondary);
        color: var(--color-text-primary);
      }
    `}
`;

const RelativePicker = styled(Picker)`
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  border-right: 0px;
`;

const TimePicker = styled(Picker)`
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
`;
