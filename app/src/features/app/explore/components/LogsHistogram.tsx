import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Space, Button, Tooltip, Checkbox, Typography } from "antd";
import dayjs from "dayjs";
import { LogsExplorePlot } from "../../../../core/components/Plots/components/LogsExplorePlot";
import { loadApplicationLogs } from "../../../../features/app/explore/logs/state/actions";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { dispatch } from "../../../../store/store";
import { StoreState } from "../../../../types/store";
import { LogLevel } from "types/logs";
import {
  getLocalStorageLogLevels,
  setLocalStorageLogLevels
} from "../../../../core/utils/localStorage";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { resetState } from "../logs/state/reducers";

const checkboxOptions = [
  { label: "Log", value: LogLevel.Log },
  { label: "Errors", value: LogLevel.Error },
  { label: "Warnings", value: LogLevel.Warn },
  { label: "Info", value: LogLevel.Info },
  { label: "Debug", value: LogLevel.Debug }
];

export const LogsHistogram = () => {
  const { id } = useParams();
  const { logs, hasFetched } = useSelector((state: StoreState) => state.logs);

  const [checkedLevels, setCheckedLevels] = useState<LogLevel[]>(
    getLocalStorageLogLevels()
  );

  const defaultStartDate = dayjs().subtract(30, "minute").unix();
  const defaultEndDate = dayjs().unix();

  const [startDate, setStartDate] = useState<number>(defaultStartDate);
  const [endDate, setEndDate] = useState<number>(defaultEndDate);

  useEffect(() => {
    const props = {
      startDate,
      endDate,
      levels: checkedLevels
    };
    dispatch(loadApplicationLogs(id, props));
    dispatch(resetState());
  }, [checkedLevels, startDate, endDate]);

  useEffect(() => setLocalStorageLogLevels(checkedLevels), [checkedLevels]);

  const onClickLeft = () => {
    setStartDate(dayjs.unix(startDate).subtract(30, "minute").unix());
    setEndDate(dayjs.unix(endDate).subtract(30, "minute").unix());
  };

  const onClickRight = () => {
    setStartDate(dayjs.unix(startDate).add(30, "minute").unix());
    setEndDate(dayjs.unix(endDate).add(30, "minute").unix());
  };

  const isActiveRightButton = dayjs(dayjs.unix(endDate).add(1, "m").unix()).isAfter(
    dayjs().unix()
  );
  const isActiveLeftButton = dayjs(startDate).isBefore(dayjs().subtract(3, "d").unix());

  return (
    <Space className="w-full" direction="vertical">
      <div className="w-full overflow-hidden flex items-center">
        <div className="float-left w-12">
          <Tooltip title="-0.5h">
            <Button disabled={isActiveLeftButton} onClick={() => onClickLeft()}>
              <ArrowLeftOutlined />
            </Button>
          </Tooltip>
        </div>
        <div className="w-11/12 float-left">
          <Space className="w-full" direction="vertical">
            <Typography.Text className="text-md font-semibold">Severity</Typography.Text>
            <Checkbox.Group
              className="mb-7"
              options={checkboxOptions}
              defaultValue={checkedLevels}
              onChange={(val) => setCheckedLevels(val as LogLevel[])}
            />
          </Space>
          <ConditionalWrapper isLoading={!hasFetched && !logs}>
            <LogsExplorePlot logs={logs} startDate={startDate} endDate={endDate} />
          </ConditionalWrapper>
        </div>
        <div className="float-right w-12">
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
