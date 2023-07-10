import { Button, Row, Select, conditionClass } from "@traceo/ui";
import { OptionsCollapseGroup } from "../explore/components/OptionsCollapseGroup";
import { PanelDatasourceTable } from "./components/PanelDatasourceTable";
import { PanelCustomizeForm } from "./components/PanelEditor/PanelCustomizeForm";
import { PanelSeriesCustomizeForm } from "./components/PanelEditor/PanelSeriesCustomizeForm";
import { QueryResponseType } from "./utils";
import { DashboardPanel, METRIC_UNIT, VISUALIZATION_TYPE } from "@traceo/types";
import { DraftFunction } from "use-immer";
import { visualizationOptions } from "./components/utils";
import { CheckOutlined } from "@ant-design/icons";

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
  onCreate: () => void;
  onCancel: () => void;
}
export const PanelContent = ({
  isCustomizeMode = false,
  isLoading = false,
  isLoadingRaw = false,
  isRawDataPreview = false,
  renderPanel = undefined,
  data = undefined,
  rawData = [],
  options = undefined,
  setOptions = undefined,
  onCancel = undefined,
  onCreate = undefined
}: Props) => {
  const onChangeVisualizationType = (value: VISUALIZATION_TYPE) => {
    setOptions((opt) => {
      opt.config.visualization = value;

      if (value === VISUALIZATION_TYPE.HISTOGRAM) {
        opt.config.unit = METRIC_UNIT.NONE;
        opt.config.tooltip.show = false;
      }
    });
  };

  const hasSeries = ![VISUALIZATION_TYPE.TEXT, VISUALIZATION_TYPE.STAT].includes(
    options.config.visualization
  );

  return (
    <div className="w-full grid grid-cols-12">
      {isCustomizeMode && hasSeries && (
        <div className="col-span-3 pt-9">
          <PanelSeriesCustomizeForm
            data={data?.datasource}
            setOptions={setOptions}
            options={options}
          />
        </div>
      )}
      <div
        className={conditionClass(
          isCustomizeMode,
          `col-span-${!hasSeries ? "9" : "6"} mx-1`,
          "col-span-12"
        )}
      >
        {isCustomizeMode && (
          <div className="flex mb-1 justify-between">
            <Select
              variant="secondary"
              options={visualizationOptions}
              defaultValue={options.config.visualization}
              onChange={(event) => onChangeVisualizationType(event?.value)}
            />
          </div>
        )}
        {renderPanel()}
        {isRawDataPreview && !isCustomizeMode && (
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
        <div className="col-span-3">
          <Row className="justify-end mb-1.5" gap="x-3">
            <Button
              icon={<CheckOutlined />}
              variant="primary"
              size="sm"
              onClick={() => onCreate()}
            >
              Save
            </Button>
            <Button variant="danger" size="sm" onClick={() => onCancel()}>
              Cancel
            </Button>
          </Row>
          <PanelCustomizeForm data={data?.datasource} setOptions={setOptions} options={options} />
        </div>
      )}
    </div>
  );
};
