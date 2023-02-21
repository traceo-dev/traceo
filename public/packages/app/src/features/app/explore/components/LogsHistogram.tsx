import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { LogsPlot } from "../../../../core/components/Plots";
import { useLogLevels } from "../../../../core/hooks/useLogLevels";
import { localStorageService } from "../../../../core/lib/localStorage";
import { LocalStorage } from "../../../../core/lib/localStorage/types";
import { statisticUtils } from "../../../../core/utils/statistics";
import { useAppDispatch } from "../../../../store";
import { loadApplicationLogs } from "../state/actions";
import { LogsFilterPanel } from "./LogsFilterPanel";
import { LeftOutlined, LoadingOutlined, RightOutlined } from "@ant-design/icons";
import { StoreState } from "@store/types";
import { Button, Card, Space, Tooltip } from "@traceo/ui";
import dayjs from "dayjs";
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export const LogsHistogram = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { logs, hasFetched } = useSelector((state: StoreState) => state.logs);
  const { levels, setLevels } = useLogLevels();

  const defaultStartDate = dayjs().subtract(30, "minute").unix();
  const defaultEndDate = dayjs().unix();

  const [startDate, setStartDate] = useState<number>(defaultStartDate);
  const [endDate, setEndDate] = useState<number>(defaultEndDate);

  useEffect(() => {
    const props = {
      startDate,
      endDate,
      levels
    };
    dispatch(loadApplicationLogs(id, props));
  }, [levels, startDate, endDate]);

  useEffect(() => {
    localStorageService.set(LocalStorage.LogLevels, levels.join(","));
  }, [levels]);

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
        <LogsFilterPanel checkedLevels={levels} setCheckedLevels={setLevels} />
      </div>
      <div className="col-span-10">
        <Card
          className="mb-0 h-full"
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
              <Button variant="ghost" onClick={onClickRight} disabled={isActiveRightButton}>
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
