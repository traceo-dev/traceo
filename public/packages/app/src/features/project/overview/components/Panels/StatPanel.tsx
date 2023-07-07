import { BaseDashboardPanel } from "./BaseDashboardPanel";
import { PanelProps } from "./types";
import { usePanelQuery } from "./usePanelQuery";
import styled from "styled-components";

export const StatPanel = ({
  panel = undefined,
  ranges = [undefined, undefined],
  ...rest
}: PanelProps) => {
  const { data, isLoading, ...queryProps } = usePanelQuery(panel.id, ranges);

  const panelStyle: React.CSSProperties = {
    fontSize: panel.config.text.size,
    fontWeight: panel.config.text.weight,
    color: panel.config.text.color
  };

  return (
    <BaseDashboardPanel
      loading={isLoading}
      isErrorExplain={false}
      panel={panel}
      ranges={ranges}
      className="h-full"
      {...rest}
      {...queryProps}
    >
      <StatContainer>
        <span style={panelStyle}>{data?.datasource}</span>
      </StatContainer>
    </BaseDashboardPanel>
  );
};

const StatContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
