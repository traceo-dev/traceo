import { FieldLabel, Input, Row } from "../index";
import { useEffect, useState, useCallback } from "react";
import { CalendarDatesType, CalendarBody } from "./CalendarBody";
import dayjs from "dayjs";
import { PickerWrapper, TimeWrapper } from "./styles";
import { setTimeToUnix } from "./utils";
import { CalendarHeader } from "./CalendarHeader";
import { TimePickerInput } from "./TimePickerInput";
import { CalendarFooter } from "./CalendarFooter";

interface Props {
  value: number;
  submit: (val: number) => void;
  disabled?: boolean;
  // Min date available on calendar
  minDate?: Date;
  // Max date available on calendar
  maxDate?: Date;
}

export const DateTimePicker = ({
  submit,
  value = null,
  disabled = false,
  minDate = null,
  maxDate = null
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<number>(value);
  const [time, setTime] = useState<string>(null);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    const from = dayjs.unix(selectedValue);
    setTime(from.format("HH:mm"));
  }, [selectedValue]);

  const handleOnSubmit = (e: any) => {
    e.preventDefault();

    submit(selectedValue);
    setOpen(false);
  };

  const handleOnChangeCalendar = useCallback(
    (date: CalendarDatesType) => {
      const dayJsTime = dayjs(date as Date)
        .set("hour", dayjs().hour())
        .set("minute", dayjs().minute());

      setSelectedValue(dayJsTime.unix());
    },
    [selectedValue]
  );

  const handleOnChangeTime = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const time = e.currentTarget.value;
      if (time && typeof time === "string") {
        const date = setTimeToUnix(time, selectedValue);
        setSelectedValue(date.unix());
      }
    },
    [selectedValue]
  );

  const popoverContent = (
    <PickerWrapper>
      <CalendarHeader title="Select date" />
      <Row className="grid grid-cols-12">
        <div className="col-span-12">
          <CalendarBody
            className="p-3"
            width={300}
            value={selectedValue}
            onChange={(date) => handleOnChangeCalendar(date)}
            minDate={minDate}
            maxDate={maxDate}
          />
          <TimeWrapper>
            <FieldLabel labelSize="xs" label="Time" className="w-full">
              <Input type="time" value={time} onChange={handleOnChangeTime} />
            </FieldLabel>
          </TimeWrapper>
        </div>
      </Row>
      <CalendarFooter onSubmit={handleOnSubmit} />
    </PickerWrapper>
  );

  return (
    <TimePickerInput
      open={open}
      popoverContent={popoverContent}
      value={value}
      onClick={() => setOpen(true)}
      disabled={disabled}
    />
  );
};
