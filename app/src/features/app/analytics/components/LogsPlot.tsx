import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Space, Typography, Button, Tooltip } from "antd";
import dayjs from "dayjs";
import { LogExploreGraph } from "core/components/Plots/components/LogExploreGraph";
import { loadApplicationLogs } from "features/app/analytics/logs/state/actions";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { dispatch } from "store/store";
import { StoreState } from "types/store";

export const LogsPlot = () => {
  const { id } = useParams();
  const { logs } = useSelector((state: StoreState) => state.logs);

  const defaultStartDate = dayjs().subtract(30, "minute").unix();
  const defaultEndDate = dayjs().unix();

  const [startDate, setStartDate] = useState<number>(defaultStartDate);
  const [endDate, setEndDate] = useState<number>(defaultEndDate);

  const onClickLeft = () => {
    setStartDate(dayjs.unix(startDate).subtract(30, "minute").unix());
    setEndDate(dayjs.unix(endDate).subtract(30, "minute").unix());
  };

  const onClickRight = () => {
    setStartDate(dayjs.unix(startDate).add(30, "minute").unix());
    setEndDate(dayjs.unix(endDate).add(30, "minute").unix());
  };

  const isActiveRightButton = dayjs(endDate).isAfter(defaultEndDate);
  const isActiveLeftButton = dayjs(startDate).isBefore(dayjs().subtract(3, "d").unix());

  useEffect(() => {
    dispatch(
      loadApplicationLogs(id, {
        startDate,
        endDate
      })
    );
  }, [startDate, endDate]);

  return (
    <Space className="w-full" direction="vertical">
      <Typography.Text className="font-semibold text-lg">Histogram</Typography.Text>
      <Space className="w-full">
        <Tooltip title="-0.5h">
          <Button disabled={isActiveLeftButton} onClick={() => onClickLeft()}>
            <ArrowLeftOutlined />
          </Button>
        </Tooltip>

        <LogExploreGraph logs={logs} startDate={startDate} endDate={endDate} />

        <Tooltip title="+0.5h">
          <Button disabled={isActiveRightButton} onClick={() => onClickRight()}>
            <ArrowRightOutlined />
          </Button>
        </Tooltip>
      </Space>
    </Space>
  );
};
