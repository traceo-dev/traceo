import {
  ZoomOutOutlined,
  ZoomInOutlined,
  PauseOutlined,
  CaretRightFilled
} from "@ant-design/icons";
import { Setter, TimeRange } from "@traceo/types";
import { Row } from "@traceo/ui";
import { ActionButton } from "../../../../core/components/ActionButton";
import { MetricTimeRangePicker } from "./MetricTimeRangePicker";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface Props {
  ranges: TimeRange;
  setRanges: Setter<TimeRange>;
  variant?: "primary" | "secondary";
}

const LIVE_INTERVAL = 15000; //15s
const ADD_SUBSTRACT_VALUE = 30; //minutes

const getCurrentRange = (): TimeRange => {
  const from = dayjs().subtract(2, "h").unix();
  const to = dayjs().unix();

  return [from, to];
};

export const MetricTimeToolbar = ({
  ranges = [undefined, undefined],
  setRanges = undefined,
  variant = "primary"
}: Props) => {
  const [live, setLive] = useState<boolean>(false);
  const [isTimeDisabled, setTimeDisabled] = useState<boolean>(false);
  const [disabledZoomIn, setDisabledZoomIn] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: NodeJS.Timer;

    if (live) {
      intervalId = setInterval(() => {
        setRanges(getCurrentRange());
      }, LIVE_INTERVAL);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [live]);

  const onLive = () => {
    const isLive = !live;

    if (isLive) {
      setRanges(getCurrentRange());
    }

    setLive(isLive);
    setTimeDisabled(isLive);
  };

  const onZoomIn = () => {
    const rangeFrom = dayjs.unix(ranges[0]);
    const rangeTo = dayjs.unix(ranges[1]);

    const from = rangeFrom.add(ADD_SUBSTRACT_VALUE, "minutes").unix();
    const to = rangeTo.subtract(ADD_SUBSTRACT_VALUE, "minutes").unix();

    setRanges([from, to]);

    const nextFrom = dayjs.unix(from).add(ADD_SUBSTRACT_VALUE, "minutes");
    const nextTo = dayjs.unix(to).subtract(ADD_SUBSTRACT_VALUE, "minutes");

    if (nextTo.isBefore(nextFrom)) {
      setDisabledZoomIn(true);
    } else {
      setDisabledZoomIn(false);
    }
  };

  const onZoomOut = () => {
    const rangeFrom = dayjs.unix(ranges[0]);
    const rangeTo = dayjs.unix(ranges[1]);

    const from = rangeFrom.subtract(ADD_SUBSTRACT_VALUE, "minutes").unix();
    const to = rangeTo.add(ADD_SUBSTRACT_VALUE, "minutes").unix();

    setRanges([from, to]);
    setDisabledZoomIn(false);
  };

  const btnType = variant === "secondary" ? "bg-primary" : undefined;

  return (
    <Row gap="x-3">
      <ActionButton
        tooltip="Zoom out"
        disabled={isTimeDisabled}
        inactiveColor={btnType}
        icon={<ZoomOutOutlined />}
        onClick={() => onZoomOut()}
      />
      <MetricTimeRangePicker
        type={variant}
        isDisabled={isTimeDisabled}
        ranges={ranges}
        setRanges={setRanges}
      />
      <ActionButton
        tooltip="Zoom in"
        disabled={isTimeDisabled || disabledZoomIn}
        inactiveColor={btnType}
        icon={<ZoomInOutlined />}
        onClick={() => onZoomIn()}
      />
      <ActionButton
        tooltip={live ? "Pause live" : "Live"}
        inactiveColor={btnType}
        isActive={live}
        icon={live ? <PauseOutlined /> : <CaretRightFilled />}
        onClick={() => onLive()}
      />
    </Row>
  );
};
