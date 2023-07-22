import { Card, Row, conditionClass } from "@traceo/ui";
import { OptionsCollapseGroup } from "../explore/components/OptionsCollapseGroup";
import { PanelDatasourceTable } from "./components/PanelDatasourceTable";
import { PanelCustomizeForm } from "./components/PanelEditor/PanelCustomizeForm";
import { PanelSeriesCustomizeForm } from "./components/PanelEditor/PanelSeriesCustomizeForm";
import { QueryResponseType } from "./utils";
import { DashboardPanel, Setter, VISUALIZATION_TYPE } from "@traceo/types";
import { DraftFunction } from "use-immer";
import { useState } from "react";
import styled, { css } from "styled-components";
import { DatasourceSelector } from "./components/PanelEditor/DatasourceSelector";
import { DataNotFound } from "../../../core/components/DataNotFound";
import { TextEditor } from "./components/PanelEditor/TextEditor";

type Option = "basic" | "datasource";

interface Props {
  isCustomizeMode?: boolean;
  isRawDataPreview?: boolean;
  isLoading?: boolean;
  isLoadingRaw?: boolean;
  renderPanel: () => void;
  data?: QueryResponseType;
  rawData?: any[];
  options: DashboardPanel;
  setOptions: (arg: DashboardPanel | DraftFunction<DashboardPanel>) => void;
}
export const PanelContent = ({
  isCustomizeMode = false,
  isLoading = false,
  isLoadingRaw = false,
  isRawDataPreview = false,
  renderPanel = undefined,
  data = {
    datasource: [],
    options: undefined
  },
  rawData = [],
  options = undefined,
  setOptions = undefined
}: Props) => {
  const [customizeOption, setCustomizeOption] = useState<Option>("basic");

  const visualization = options.config.visualization;
  const hasSeries = ![VISUALIZATION_TYPE.TEXT, VISUALIZATION_TYPE.STAT].includes(visualization);
  const seriesCount = options.config.series.length ?? 0;

  return (
    <div className="w-full grid grid-cols-12">
      <div className={conditionClass(isCustomizeMode, `col-span-8 mx-1`, "col-span-12")}>
        {renderPanel()}

        {isCustomizeMode && visualization === VISUALIZATION_TYPE.TEXT && (
          <TextEditor options={options} setOptions={setOptions} />
        )}

        {isCustomizeMode && hasSeries && (
          <DatasourceSelector data={data} options={options} setOptions={setOptions} />
        )}

        {!isCustomizeMode && isRawDataPreview && (
          <OptionsCollapseGroup
            title="Raw data"
            loading={isLoading}
            extra={
              <span className="text-xs font-semibold text-primary">
                {(rawData || []).length} rows found
              </span>
            }
          >
            <PanelDatasourceTable panel={options} metricData={rawData} isLoading={isLoadingRaw} />
          </OptionsCollapseGroup>
        )}
      </div>
      {isCustomizeMode && (
        <div className="col-span-4 flex flex-col gap-1">
          {hasSeries && (
            <OptionSwitcher
              option={customizeOption}
              onChange={setCustomizeOption}
              datasourceCount={seriesCount}
            />
          )}

          {customizeOption === "basic" && (
            <PanelCustomizeForm setOptions={setOptions} options={options} />
          )}

          {customizeOption === "datasource" &&
            (options.config.series.length === 0 ? (
              <Card>
                <DataNotFound label="Datasources not found" />
              </Card>
            ) : (
              <PanelSeriesCustomizeForm setOptions={setOptions} options={options} />
            ))}
        </div>
      )}
    </div>
  );
};

interface SwitcherProps {
  option: Option;
  onChange: Setter<Option>;
  datasourceCount: number;
}

const OptionSwitcherContainer = styled.div`
  font-size: 13px;
  user-select: none;
  display: flex;
  flex-direction: row;
  border: 1px solid var(--color-bg-secondary);
  font-weight: 500;
  padding: 3px;
  gap: 3px;
`;

const SwitcherOption = styled.span`
  width: 50%;
  padding: 5px;
  padding-inline: 12px;
  cursor: pointer;
  background-color: var(--color-bg-canvas);

  ${(props) =>
    props.isSelected &&
    css`
      background-color: var(--color-bg-primary);
    `}
`;

const OptionSwitcher = ({ option, onChange, datasourceCount = 0 }: SwitcherProps) => {
  return (
    <OptionSwitcherContainer>
      <SwitcherOption isSelected={option === "basic"} onClick={() => onChange("basic")}>
        Basic visualization
      </SwitcherOption>
      <SwitcherOption isSelected={option === "datasource"} onClick={() => onChange("datasource")}>
        <Row className="justify-between">
          <span>Datasource options</span>
          <span className="text-yellow-600">{datasourceCount}</span>
        </Row>
      </SwitcherOption>
    </OptionSwitcherContainer>
  );
};
