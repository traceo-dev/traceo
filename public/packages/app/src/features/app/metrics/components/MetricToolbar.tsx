import { useAppDispatch } from "../../../../store/index";
import { hideNavbar } from "../../../../store/internal/navbar/actions";
import { MetricTimeRangePicker } from "./MetricTimeRangePicker";
import { SettingOutlined, CompressOutlined, ExpandOutlined } from "@ant-design/icons";
import { Tooltip } from "@traceo/ui";

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

  const onExpand = () => {
    dispatch(hideNavbar(true));
    setExpandMode(true);
  };

  const onCompress = () => {
    dispatch(hideNavbar(false));
    setExpandMode(false);
  };

  const onCustomize = () => {
    setCustomizeMode(true);
    dispatch(hideNavbar(true));
  };

  const graphToolbarTools = () => {
    const tools = [];

    if (isCustomizeMode) {
      return [];
    }

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
      {!isCustomizeMode && <MetricTimeRangePicker ranges={ranges} setRanges={setRanges} />}
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
