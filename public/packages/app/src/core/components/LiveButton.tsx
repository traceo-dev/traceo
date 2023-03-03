import { CaretRightFilled, PauseOutlined } from "@ant-design/icons";
import { Tooltip } from "@traceo/ui";
import { joinClasses, conditionClass } from "../utils/classes";

interface Props {
  live: boolean;
  onClick?: () => void;
  tooltipLive?: string;
  tooltipLiveStop?: string;
}
export const LiveButton = ({
  live = false,
  onClick,
  tooltipLive = "",
  tooltipLiveStop = ""
}: Props) => {
  return (
    <Tooltip title={live ? tooltipLive : tooltipLiveStop}>
      <div className="cursor-pointer" onClick={() => onClick()}>
        <div
          className={joinClasses(
            "px-3 py-1 flex flex-row items-center gap-x-3 border-canvas border border-solid rounded",
            conditionClass(
              live,
              "border-red-500 text-red-500 font-semibold",
              "border-light-secondary text-secondary"
            )
          )}
        >
          <span>Live</span>
          {!live ? <CaretRightFilled /> : <PauseOutlined />}
        </div>
      </div>
    </Tooltip>
  );
};
