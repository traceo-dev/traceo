import { BaseDashboardPanel } from "./BaseDashboardPanel";
import { PanelProps } from "./types";
import MarkdownPreview from "@uiw/react-markdown-preview";
import styled from "styled-components";

const Scroll = styled.div`
  position: relative;
  overflow: scroll;
  display: flex;
  -webkit-box-flex: 1;
  flex-grow: 1;
  flex-direction: column;

  ::-webkit-scrollbar-corner {
    background-color: transparent;
  }
`;

export const TextPanel = ({
  panel = undefined,
  ranges = [undefined, undefined],
  ...rest
}: PanelProps) => {
  return (
    <BaseDashboardPanel panel={panel} ranges={ranges} className="h-full" {...rest}>
      <Scroll isHeader={!!panel.title}>
        <MarkdownPreview
          className="bg-transparent"
          source={panel.config.text.value}
          disableCopy={true}
        />
      </Scroll>
    </BaseDashboardPanel>
  );
};
