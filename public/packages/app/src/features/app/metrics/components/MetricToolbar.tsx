import {
  SyncOutlined,
  SettingOutlined,
  CompressOutlined,
  ExpandOutlined
} from "@ant-design/icons";
import { useAppDispatch } from "../../../../store/index";
import { Tooltip } from "@traceo/ui";
import { toggleNavbar } from "../../state/navbar/actions";
import { loadMetric } from "../state/actions";
import { useParams } from "react-router-dom";
import { MetricTimeRangePicker } from "./MetricTimeRangePicker";

interface Props {
  isCustomizeMode: boolean;
  setCustomizeMode: (val: boolean) => void;
  isExpandMode: boolean;
  setExpandMode: (val: boolean) => void;
  ranges: [number, number];
  setRanges: (val: [number, number]) => void;
}
export const MetricToolbar = ({
  isCustomizeMode,
  isExpandMode,
  ranges,
  setCustomizeMode,
  setExpandMode,
  setRanges
}: Props) => {
  const dispatch = useAppDispatch();
  const { id, metricId } = useParams();

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

  const refreshGraph = () => {
    const payload = {
      appId: id,
      metricId,
      from: ranges[0],
      to: ranges[1]
    };
    dispatch(loadMetric(payload));
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
        refreshGraph();
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
    <div className="flex flex-row items-center gap-x-3">
      {!isCustomizeMode && (
        <MetricTimeRangePicker ranges={ranges} setRanges={setRanges} />
      )}
      {graphToolbarTools().map((tool, index) => (
        <Tooltip title={tool.title} key={index}>
          <div
            className="cursor-pointer p-1 px-2 border-2 rounded bg-canvas"
            onClick={tool.onClick}
          >
            {tool.icon}
          </div>
        </Tooltip>
      ))}
    </div>
  );
};
