import { Alert, FieldLabel, Input, Row } from "../index";
import { useEffect, useState, useCallback } from "react";
import { CalendarDatesType, CalendarBody } from "./CalendarBody";
import dayjs, { ManipulateType } from "dayjs";
import { conditionClass, joinClasses } from "../utils/classes";
import { PickerWrapper, TimeWrapper } from "./styles";
import { TimePickerInput } from "./TimePickerInput";
import { setTimeToUnix, validateInput } from "./utils";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarFooter } from "./CalendarFooter";
import { OptionsContainer, RelativeTimeOption } from "./OptionsContainer";

interface Props {
  value: [number, number];
  submit: (val: [number, number]) => void;
  // List of options on panel left side
  options?: RelativeTimeOption[];
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

export const TimeRangePicker = ({
  submit,
  value = null,
  options = [],
  maxHourPeriod = null,
  disabled = false,
  datesRange = false,
  maxDate = null,
  minDate = null,
  type = "primary"
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>(null);
  const [selectedValue, setSelectedValue] = useState<[number, number]>(value);
  const [from, setFrom] = useState<string>(null);
  const [to, setTo] = useState<string>(null);

  const hasOptions = options.length > 0;

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    const from = dayjs.unix(selectedValue[0]);
    const to = dayjs.unix(selectedValue[1]);

    setFrom(from.format("HH:mm"));
    setTo(to.format("HH:mm"));

    const error = validateInput(from, to, maxHourPeriod);
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
      const time = e.currentTarget.value;
      if (time && typeof time === "string") {
        const date = setTimeToUnix(time, selectedValue[1]);
        setSelectedValue([selectedValue[0], date.unix()]);
      }
    },
    [selectedValue]
  );

  const handleOnClickOption = useCallback(
    (value: number, unit: ManipulateType) => {
      const from = dayjs().subtract(value, unit).unix();
      const to = dayjs().unix();
      setSelectedValue([from, to]);
    },
    [selectedValue]
  );

  const popoverContent = (
    <PickerWrapper>
      <CalendarHeader title="Select time range" />
      <Row className="grid grid-cols-12">
        {hasOptions && <OptionsContainer options={options} onSelect={handleOnClickOption} />}
        <div className={joinClasses(conditionClass(hasOptions, "col-span-8", "col-span-12"))}>
          <CalendarBody
            className="p-3"
            width={300}
            range={datesRange}
            values={selectedValue}
            onChange={(date) => handleOnChangeCalendar(date)}
            maxDate={maxDate}
            minDate={minDate}
          />
          <TimeWrapper>
            <FieldLabel labelSize="xs" label="Time from" className="w-full">
              <Input type="time" value={from} onChange={handleOnChangeTimeFrom} />
            </FieldLabel>
            <FieldLabel labelSize="xs" label="Time to" className="w-full">
              <Input type="time" value={to} onChange={handleOnChangeTimeTo} />
            </FieldLabel>
          </TimeWrapper>
          {error && <Alert type="error" message={error} />}
        </div>
      </Row>
      <CalendarFooter disabledApplyBtn={!!error} onSubmit={handleOnSubmit} />
    </PickerWrapper>
  );

  return (
    <TimePickerInput
      open={open}
      popoverContent={popoverContent}
      values={value}
      range={datesRange}
      onClick={() => setOpen(true)}
      disabled={disabled}
      type={type}
    />
  );
};
