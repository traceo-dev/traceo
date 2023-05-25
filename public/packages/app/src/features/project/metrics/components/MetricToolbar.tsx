import { useAppDispatch } from "../../../../store/index";
import { hideNavbar } from "../../../../store/internal/navbar/actions";
import { MetricTimeRangePicker } from "./MetricTimeRangePicker";
import { CaretRightFilled, PauseOutlined, SettingOutlined } from "@ant-design/icons";
import { Tooltip } from "@traceo/ui";
import { useProject } from "../../../../core/hooks/useProject";
import { MemberRole } from "@traceo/types";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { ActionButton } from "../../explore/components/ActionButton";

interface Props {
  isCustomizeMode: boolean;
  ranges: [number, number];
  setRanges: (val: [number, number]) => void;
  setCustomizeMode?: (val: boolean) => void;
}

const LIVE_INTERVAL = 15000; //15s

const getCurrentRange = (): [number, number] => {
  const from = dayjs().subtract(2, "h").unix();
  const to = dayjs().unix();

  return [from, to];
};

export const MetricToolbar = ({
  isCustomizeMode,
  ranges,
  setCustomizeMode,
  setRanges
}: Props) => {
  const dispatch = useAppDispatch();
  const { permission } = useProject();

  const onCustomize = () => {
    setCustomizeMode && setCustomizeMode(true);
    dispatch(hideNavbar(true));
  };

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

  const graphToolbarTools = () => {
    const tools = [];

    if (isCustomizeMode) {
      return [];
    }

    if (permission !== MemberRole.VIEWER && !live) {
      tools.push({
        title: "Customize graph",
        icon: <SettingOutlined />,
        onClick: () => onCustomize()
      });
    }

    tools.push({
      title: live ? "Pause live" : "Live",
      icon: live ? <PauseOutlined /> : <CaretRightFilled />,
      onClick: () => onLive(),
      isActive: live
    });

    return tools;
  };

  return (
    <div className="flex flex-row items-center gap-x-3">
      {!isCustomizeMode && (
        <MetricTimeRangePicker
          isDisabled={isTimeDisabled}
          ranges={ranges}
          setRanges={setRanges}
        />
      )}
      {graphToolbarTools().map((tool, index) => (
        <ActionButton
          key={index}
          tooltip={tool.title}
          onClick={tool.onClick}
          icon={tool.icon}
          isActive={tool?.isActive}
        />
      ))}
    </div>
  );
};
