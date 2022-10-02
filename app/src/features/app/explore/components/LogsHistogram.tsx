import { ArrowLeftOutlined, ArrowRightOutlined, SyncOutlined } from "@ant-design/icons";
import { Space, Typography, Button, Tooltip } from "antd";
import dayjs from "dayjs";
import { LogsExplorePlot } from "core/components/Plots/components/LogsExplorePlot";
import { loadApplicationLogs } from "features/app/explore/logs/state/actions";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { dispatch } from "store/store";
import { StoreState } from "types/store";
import { fetchedState } from "../logs/state/reducers";

export const LogsHistogram = () => {
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
    dispatch(fetchedState());
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
      <div
        style={{
          width: "100%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center"
        }}
      >
        <div style={{ width: "5%", float: "left" }}>
          <Tooltip title="-0.5h">
            <Button disabled={isActiveLeftButton} onClick={() => onClickLeft()}>
              <ArrowLeftOutlined />
            </Button>
          </Tooltip>
        </div>
        <div style={{ width: "90%", float: "left" }}>
          <LogsExplorePlot logs={logs} startDate={startDate} endDate={endDate} />
        </div>
        <div style={{ width: "5%", float: "right" }}>
          <Tooltip title="+0.5h">
            <Button disabled={isActiveRightButton} onClick={() => onClickRight()}>
              <ArrowRightOutlined />
            </Button>
          </Tooltip>
        </div>
      </div>
    </Space>
  );
};
