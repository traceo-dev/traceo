import { FC } from "react";
import Calendar from "react-calendar";
import styled from "styled-components";
import { parseUnixToDate } from "./utils";

export type CalendarDatesType = number | [number, number] | Date[] | Date;
interface Props {
  value?: number;
  values?: [number, number];
  onChange?: (val: CalendarDatesType) => void;
  range?: boolean;
  width?: number;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

export const CalendarBody: FC<Props> = ({
  value,
  values,
  onChange,
  range = false,
  width = null,
  className = "",
  minDate = null,
  maxDate = null
}) => {
  const parseValueToDate = () => {
    if (value) {
      return new Date(value * 1e3);
    }
    if (values) {
      return parseUnixToDate(values, range);
    }
  };
  return (
    <CalendarWrapper className={className} width={width}>
      <Calendar
        value={parseValueToDate()}
        onChange={onChange}
        selectRange={range}
        next2Label={null}
        prev2Label={null}
        locale="en"
        maxDate={maxDate}
        minDate={minDate}
      />
    </CalendarWrapper>
  );
};

const CalendarWrapper = styled.div`
  ${(p) => p.width && `width: ${p.width}px !important`};

  .react-calendar__navigation {
    text-align: center;
  }

  .react-calendar__navigation__label__labelText--from {
    cursor: pointer;
  }

  .react-calendar__navigation__label,
  .react-calendar__navigation__arrow,
  .react-calendar__navigation {
    padding-top: 4px;
    padding-bottom: 12px;
    background-color: inherit;
    border: 0;
    cursor: pointer;
  }

  .react-calendar__month-view__weekdays {
    background-color: inherit;
    text-align: center;
    color: var(--color-traceo-primary);
    padding-bottom: 12px;
  }

  .react-calendar__month-view__weekdays__weekday > abbr {
    text-decoration: none;
    font-weight: 600;
  }

  .react-calendar__tile,
  .react-calendar__tile--now {
    margin-bottom: 4px;
    background-color: inherit;
    height: 26px;
    width: 10px;
    border: none;
    cursor: pointer;
  }

  .react-calendar__tile--active {
    box-shadow: none;
    border: 0px;
    font-weight: 600;
    color: var(--color-bg-canvas);
    background-color: var(--color-traceo-primary);
  }

  .react-calendar__tile[disabled] {
    color: gray;
    cursor: auto;
  }

  .react-calendar__tile--rangeStart {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    background-color: var(--color-traceo-primary);
    color: var(--color-bg-canvas);
    font-weight: 600;
  }

  .react-calendar__tile--rangeEnd {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    background-color: var(--color-traceo-primary);
    color: var(--color-bg-canvas);
    font-weight: 600;
  }
`;
