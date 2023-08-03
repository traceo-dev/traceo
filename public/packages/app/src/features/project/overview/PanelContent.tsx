import { Card, Row, SelectOptionProps, Tooltip, conditionClass } from "@traceo/ui";
import { OptionsCollapseGroup } from "../explore/components/OptionsCollapseGroup";
import { PanelDatasourceTable } from "./components/PanelDatasourceTable";
import { PanelCustomizeForm } from "./components/PanelEditor/PanelCustomizeForm";
import { PanelSeriesCustomizeForm } from "./components/PanelEditor/PanelSeriesCustomizeForm";
import { DashboardPanel, Setter, VISUALIZATION_TYPE, isEmpty } from "@traceo/types";
import { DraftFunction } from "use-immer";
import { useState } from "react";
import styled, { css } from "styled-components";
import { DatasourceSelector } from "./components/PanelEditor/DatasourceSelector";
import { DataNotFound } from "../../../core/components/DataNotFound";
import { TextEditor } from "./components/PanelEditor/TextEditor";
import { WarningFilled } from "@ant-design/icons";
import { useReactQuery } from "../../../core/hooks/useReactQuery";
import { useParams } from "react-router-dom";

type Option = "basic" | "datasource";

interface Props {
  isCustomizeMode?: boolean;
  isRawDataPreview?: boolean;
  isLoading?: boolean;
  isLoadingRaw?: boolean;
  renderPanel: () => void;
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
  rawData = [],
  options = undefined,
  setOptions = undefined
}: Props) => {
  const { id } = useParams();
  const [customizeOption, setCustomizeOption] = useState<Option>("basic");

  const visualization = options.config.visualization;
  const hasSeries = ![VISUALIZATION_TYPE.TEXT, VISUALIZATION_TYPE.STAT].includes(visualization);
  const seriesCount = options.config.series.length ?? 0;

  const hasRandomDatasource = !isEmpty(
    options.config.series.filter(({ datasource }) => datasource.field === "random_datasource")
  );

  const { data: fieldsOptions = [] } = useReactQuery<SelectOptionProps[]>({
    queryKey: [`panels_fields_key`],
    url: `/api/metrics/fields/${id}`
  });

  return (
    <div className="w-full grid grid-cols-12">
      <div className={conditionClass(isCustomizeMode, `col-span-8 mx-1`, "col-span-12")}>
        {renderPanel()}

        {isCustomizeMode && visualization === VISUALIZATION_TYPE.TEXT && (
          <TextEditor options={options} setOptions={setOptions} />
        )}

        {isCustomizeMode && hasSeries && (
          <DatasourceSelector
            options={options}
            fieldsOptions={fieldsOptions}
            setOptions={setOptions}
          />
        )}

        {!isCustomizeMode && isRawDataPreview && (
          <OptionsCollapseGroup
            title={
              <Row className="gap-x-2">
                <span>Raw data</span>
                {hasRandomDatasource && (
                  <Tooltip title="This visualization has one or more series with random data. Table overview for these series is not available.">
                    <WarningFilled className="text-error cursor-pointer" />
                  </Tooltip>
                )}
              </Row>
            }
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
            (isEmpty(options.config.series) ? (
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
