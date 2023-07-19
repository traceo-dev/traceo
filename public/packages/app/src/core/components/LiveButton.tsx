import { CaretRightFilled, PauseOutlined } from "@ant-design/icons";
import { Tooltip } from "@traceo/ui";
import styled from "styled-components";

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
      <div className="cursor-pointer">
        <LiveWrapper live={live} onClick={() => onClick()}>
          <span>Live</span>
          {!live ? <CaretRightFilled /> : <PauseOutlined />}
        </LiveWrapper>
      </div>
    </Tooltip>
  );
};

const LiveWrapper = styled.div`
  border: 1px solid var(--color-bg-canvas);
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  padding-top: 0.25rem; /* 4px */
  padding-bottom: 0.25rem; /* 4px */
  padding-left: 0.75rem; /* 12px */
  padding-right: 0.75rem; /* 12px */
  align-items: center;
  column-gap: 0.75rem; /* 12px */
  cursor: pointer;

  ${(p) =>
    p.live
      ? `
    border-color: #E8484A;
    color: #E8484A;
    font-weight: 500;
  `
      : `
    border-color: var(--color-bg-light-secondary);
    color: var(--color-text-secondary)
  `}
`;
