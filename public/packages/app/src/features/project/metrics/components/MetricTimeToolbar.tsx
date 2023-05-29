import {
  ZoomOutOutlined,
  ZoomInOutlined,
  PauseOutlined,
  CaretRightFilled
} from "@ant-design/icons";
import { Setter } from "@traceo/types";
import { Row } from "@traceo/ui";
import { ActionButton } from "../../explore/components/ActionButton";
import { MetricTimeRangePicker } from "./MetricTimeRangePicker";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface Props {
  ranges: [number, number];
  setRanges: Setter<[number, number]>;
}

const LIVE_INTERVAL = 15000; //15s

const getCurrentRange = (): [number, number] => {
  const from = dayjs().subtract(2, "h").unix();
  const to = dayjs().unix();

  return [from, to];
};

export const MetricTimeToolbar = ({ ranges, setRanges }: Props) => {
  const [live, setLive] = useState<boolean>(false);
  const [isTimeDisabled, setTimeDisabled] = useState<boolean>(false);

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

  const [disabledZoomIn, setDisabledZoomIn] = useState<boolean>(false);

  const onZoomIn = () => {
    const rangeFrom = dayjs.unix(ranges[0]);
    const rangeTo = dayjs.unix(ranges[1]);

    const from = rangeFrom.add(1, "h").unix();
    const to = rangeTo.subtract(1, "h").unix();

    setRanges([from, to]);

    const nextFrom = dayjs.unix(from).add(1, "h");
    const nextTo = dayjs.unix(to).subtract(1, "h");

    if (nextTo.isBefore(nextFrom)) {
      setDisabledZoomIn(true);
    } else {
      setDisabledZoomIn(false);
    }
  };

  const onZoomOut = () => {
    const rangeFrom = dayjs.unix(ranges[0]);
    const rangeTo = dayjs.unix(ranges[1]);

    const from = rangeFrom.subtract(1, "h").unix();
    const to = rangeTo.add(1, "h").unix();

    setRanges([from, to]);
    setDisabledZoomIn(false);
  };
  return (
    <Row gap="x-3">
      <ActionButton
        tooltip="Zoom out"
        disabled={isTimeDisabled}
        inactiveColor="bg-primary"
        icon={<ZoomOutOutlined />}
        onClick={() => onZoomOut()}
      />
      <MetricTimeRangePicker isDisabled={isTimeDisabled} ranges={ranges} setRanges={setRanges} />
      <ActionButton
        tooltip="Zoom in"
        disabled={isTimeDisabled || disabledZoomIn}
        inactiveColor="bg-primary"
        icon={<ZoomInOutlined />}
        onClick={() => onZoomIn()}
      />
      <ActionButton
        tooltip={live ? "Pause live" : "Live"}
        inactiveColor="bg-primary"
        isActive={live}
        icon={live ? <PauseOutlined /> : <CaretRightFilled />}
        onClick={() => onLive()}
      />
    </Row>
  );
};
