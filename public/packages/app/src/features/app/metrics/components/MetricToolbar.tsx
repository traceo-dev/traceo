import { useAppDispatch } from "../../../../store/index";
import { hideNavbar } from "../../../../store/internal/navbar/actions";
import { MetricTimeRangePicker } from "./MetricTimeRangePicker";
import { SettingOutlined } from "@ant-design/icons";
import { Tooltip } from "@traceo/ui";

interface Props {
  isCustomizeMode: boolean;
  setCustomizeMode: (val: boolean) => void;
  ranges: [number, number];
  setRanges: (val: [number, number]) => void;
}
export const MetricToolbar = ({
  isCustomizeMode,
  ranges,
  setCustomizeMode,
  setRanges
}: Props) => {
  const dispatch = useAppDispatch();

  const onCustomize = () => {
    setCustomizeMode(true);
    dispatch(hideNavbar(true));
  };

  const graphToolbarTools = () => {
    const tools = [];

    if (isCustomizeMode) {
      return [];
    }

    tools.push({
      title: "Customize graph",
      icon: <SettingOutlined />,
      onClick: () => onCustomize()
    });

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
