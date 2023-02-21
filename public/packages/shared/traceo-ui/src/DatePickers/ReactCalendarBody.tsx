import dayjs from "dayjs";
import { FC, useMemo } from "react";
import Calendar from "react-calendar";
import styled from "styled-components";

interface Props {
  value: [number, number];
  onChange: (val: [Date, Date]) => void;
  range?: boolean;
}

const parseUnixToDate = (unix: number) => new Date(unix * 1e3);

export const ReactCalendarBody: FC<Props> = ({ value, onChange, range = false }) => {
  const rangeValue = useMemo(() => [parseUnixToDate(value[0]), parseUnixToDate(value[1])], value);

  return (
    <CalendarWrapper>
      <Calendar
        value={rangeValue}
        onChange={onChange}
        selectRange={range}
        next2Label={null}
        prev2Label={null}
        locale="en"
        maxDate={new Date(dayjs().unix() * 1e3)}
      />
    </CalendarWrapper>
  );
};

const CalendarWrapper = styled.div`
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

  .react-calendar__tile:hover,
  .react-calendar__tile--active:hover {
    background-color: var(--color-bg-secondary);
    color: white;
    border-radius: 20px;
  }

  .react-calendar__tile--active {
    box-shadow: none;
    border: 0px;
    font-weight: 600;
    color: var(--color-bg-canvas);
    background-color: var(--color-traceo-primary);
    border-radius: 20px;
  }

  .react-calendar__tile[disabled] {
    color: gray;
    cursor: auto;
  }
`;
