import { LeftOutlined, LoadingOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { loadApplicationLogs } from "../state/actions";
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../../store";
import { StoreState } from "../../../../types/store";
import { LogLevel } from "../../../../types/logs";
import {
  getLocalStorageLogLevels,
  setLocalStorageLogLevels
} from "../../../../core/utils/localStorage";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { LogsFilterPanel } from "./LogsFilterPanel";
import { Button } from "../../../../core/ui-components/Button";
import { Card } from "../../../../core/ui-components/Card";
import { Space } from "../../../../core/ui-components/Space";
import { Tooltip } from "../../../../core/ui-components/Tooltip";
import { statisticUtils } from "../../../../core/utils/statistics";
import { LogsPlot } from "../../../../core/components/Plots";

export const LogsHistogram = () => {
  const dispatch = useAppDispatch();
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

  const isActiveRightButton = dayjs(dayjs.unix(endDate).add(5, "m").unix()).isAfter(
    dayjs().unix()
  );
  const isActiveLeftButton = dayjs(startDate).isBefore(dayjs().subtract(3, "d").unix());

  const dataSource = useMemo(() => {
    return statisticUtils.parseExploreLogsPlotData(startDate, endDate, logs);
  }, [logs]);

  return (
    <div className="grid grid-cols-12 w-full mb-1">
      <div className="col-span-2 h-full mr-1">
        <LogsFilterPanel
          checkedLevels={checkedLevels}
          setCheckedLevels={setCheckedLevels}
        />
      </div>
      <div className="col-span-10">
        <Card
          className="mb-0"
          title="Histogram"
          extra={!hasFetched && <LoadingOutlined />}
        >
          <Space className="w-full justify-end">
            <Tooltip title="- 0.5h">
              <Button variant="ghost" onClick={onClickLeft} disabled={isActiveLeftButton}>
                <LeftOutlined className="text-sm" />
              </Button>
            </Tooltip>

            <Tooltip title="+ 0.5h">
              <Button
                variant="ghost"
                onClick={onClickRight}
                disabled={isActiveRightButton}
              >
                <RightOutlined className="text-sm" />
              </Button>
            </Tooltip>
          </Space>

          <ConditionalWrapper isLoading={!hasFetched && !logs}>
            <LogsPlot logs={dataSource} />
          </ConditionalWrapper>
        </Card>
      </div>
    </div>
  );
};
