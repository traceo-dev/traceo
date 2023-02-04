import { MetricTableWrapper } from "./components/MetricTableWrapper";
import { useSelector } from "react-redux";
import { StoreState } from "@store/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../store";
import { loadMetric } from "./state/actions";
import { conditionClass } from "../../../core/utils/classes";
import { MetricPreviewHeader } from "./components/MetricPreviewHeader";
import { MetricCustomizeForm } from "./components/MetricCustomizeForm";
import { IMetric, DeepPartial } from "@traceo/types";
import { useImmer } from "use-immer";
import { toggleNavbar } from "../state/navbar/actions";
import {
  CompressOutlined,
  ExpandOutlined,
  SettingOutlined,
  SyncOutlined
} from "@ant-design/icons";
import { getLocalStorageTimeLimit } from "../../../core/utils/localStorage";
import { Card, Tooltip } from "@traceo/ui";
import { MetricPreviewPlot } from "../../../core/components/Plots";
import { Page } from "../../../core/components/Page";
import { notify } from "src/core/utils/notify";

export const MetricPreviewPage = () => {
  const DEFAULT_TIME_LIMIT = getLocalStorageTimeLimit() || 12;

  const { metricId, id } = useParams();
  const dispatch = useAppDispatch();
  const { metric, hasFetchedMetric } = useSelector((state: StoreState) => state.metrics);
  const [options, setOptions] = useImmer<DeepPartial<IMetric>>(metric?.options);
  const [isCustomizeMode, setCustomizeMode] = useState<boolean>(false);
  const [isExpandMode, setExpandMode] = useState<boolean>(false);
  const [timeLimit, setTimeLimit] = useState<number>(DEFAULT_TIME_LIMIT);

  useEffect(() => fetchMetric(), [timeLimit]);

  useEffect(() => {
    if (metric) {
      setOptions(metric.options);
    }
  }, [metric]);

  const fetchMetric = () => {
    const payload = {
      appId: id,
      metricId,
      hrCount: timeLimit
    };
    dispatch(loadMetric(payload));
  };

  const onExpand = () => {
    dispatch(toggleNavbar(true));
    setExpandMode(true);
  };

  const onCompress = () => {
    dispatch(toggleNavbar(false));
    setExpandMode(false);
  };

  const onCustomize = () => {
    setCustomizeMode(true);
    dispatch(toggleNavbar(true));
  };

  const graphToolbarTools = () => {
    const tools = [];

    if (isCustomizeMode) {
      return [];
    }

    tools.push({
      title: "Refresh graph",
      icon: <SyncOutlined />,
      onClick: () => {
        fetchMetric(), notify.success("Refreshed");
      }
    });

    if (!isExpandMode) {
      tools.push({
        title: "Customize graph",
        icon: <SettingOutlined />,
        onClick: () => onCustomize()
      });
    }

    if (isExpandMode) {
      tools.push({
        title: "Compress view",
        icon: <CompressOutlined />,
        onClick: () => onCompress()
      });
    }

    if (!isExpandMode) {
      tools.push({
        title: "Expand view",
        icon: <ExpandOutlined />,
        onClick: () => onExpand()
      });
    }

    return tools;
  };

  return (
    <Page isLoading={!hasFetchedMetric || !metric?.options}>
      <MetricPreviewHeader
        currentOptions={options}
        isCustomizeMode={isCustomizeMode}
        setCustomizeMode={setCustomizeMode}
        setOptions={setOptions}
        timeLimit={timeLimit}
        setTimeLimit={setTimeLimit}
      />
      <Page.Content>
        <div className="w-full grid grid-cols-12">
          <div className={conditionClass(isCustomizeMode, "col-span-8", "col-span-12")}>
            <Card
              title="Graph"
              extra={
                <div className="flex flex-row items-center gap-x-5">
                  {graphToolbarTools().map((tool, index) => (
                    <Tooltip title={tool.title} key={index}>
                      <div className="cursor-pointer" onClick={tool.onClick}>
                        {tool.icon}
                      </div>
                    </Tooltip>
                  ))}
                </div>
              }
            >
              <MetricPreviewPlot isExpandMode={isExpandMode} options={options} />
            </Card>

            {!isExpandMode && (
              <MetricTableWrapper metric={options} metricData={metric?.datasource} />
            )}
          </div>
          {isCustomizeMode && (
            <MetricCustomizeForm setOptions={setOptions} options={options} />
          )}
        </div>
      </Page.Content>
    </Page>
  );
};

export default MetricPreviewPage;
