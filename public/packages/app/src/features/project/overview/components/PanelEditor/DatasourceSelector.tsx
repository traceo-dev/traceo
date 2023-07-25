import { PlusOutlined, CloseOutlined, DatabaseFilled } from "@ant-design/icons";
import { IMetricSerie, DashboardPanel, VISUALIZATION_TYPE } from "@traceo/types";
import { Row, Select, SelectOptionProps } from "@traceo/ui";
import { Fragment } from "react";
import { DataNotFound } from "../../../../../core/components/DataNotFound";
import { OptionsCollapseGroup } from "../../../../../features/project/explore/components/OptionsCollapseGroup";
import { DraftFunction } from "use-immer";
import { ToolbarButton } from "../Toolbars/ToolbarButton";
import { randomHexColor } from "../../../../../core/utils/colors";
import { useParams } from "react-router-dom";
import { useReactQuery } from "../../../../../core/hooks/useReactQuery";
import { QueryResponseType } from "../../utils";

interface Props {
  data: QueryResponseType;
  options: DashboardPanel;
  setOptions: (arg: DashboardPanel | DraftFunction<DashboardPanel>) => void;
}
export const DatasourceSelector = ({ options, setOptions, data }: Props) => {
  const { id } = useParams();

  const series = options.config.series ?? [];
  const isHistogram = options.config.visualization === VISUALIZATION_TYPE.HISTOGRAM;

  const { data: fieldsOptions = [] } = useReactQuery<SelectOptionProps[]>({
    queryKey: [`panels_fields_key`],
    url: `/api/metrics/fields/${id}`
  });

  const onAddNewSerie = () => {
    const serie: IMetricSerie = {
      description: undefined,
      datasource: {
        field: undefined
      },
      config: {
        area: {
          show: false,
          opacity: 50
        },
        barWidth: 90,
        color: randomHexColor(),
        lineWidth: 1,
        type: "line"
      }
    };

    data.datasource.push([]);
    setOptions((opt) => {
      opt.config.series.push(serie);
    });
  };

  const onDeleteSerie = (serie: IMetricSerie) => {
    const newSeries = series.filter((s) => s !== serie);
    setOptions((opt) => {
      opt.config.series = newSeries;
    });
  };

  return (
    <OptionsCollapseGroup
      title="Datasource"
      extra={
        <ToolbarButton
          onClick={onAddNewSerie}
          icon={<PlusOutlined />}
          name="Add datasource"
          // Disable to avoid more than 10 sources or when Histogram has more than 1 source
          disabled={series.length === 10 || (isHistogram && series.length >= 1)}
        />
      }
      deafultCollapsed={false}
      scrollableBody={false}
    >
      <Fragment>
        {series.length === 0 && (
          <DataNotFound
            label="No datasource fields selected"
            explanation="Select up to 10 datasource fields to visualize the data in the graph."
          />
        )}

        {series.map((serie, index) => (
          <Datasource
            key={index}
            index={index}
            options={fieldsOptions}
            serie={serie}
            setOptions={setOptions}
            // Cannot delete last datasource for histogram, there should be just one source.
            onDeleteSerie={isHistogram && series.length === 1 ? undefined : onDeleteSerie}
          />
        ))}
      </Fragment>
    </OptionsCollapseGroup>
  );
};

interface DatasourceProps {
  index: number;
  options: SelectOptionProps[];
  serie: IMetricSerie;
  onDeleteSerie: (serie: IMetricSerie) => void;
  setOptions: (arg: DashboardPanel | DraftFunction<DashboardPanel>) => void;
}
const Datasource = ({
  index = 0,
  options = [],
  serie = undefined,
  setOptions = undefined,
  onDeleteSerie = undefined
}: DatasourceProps) => {
  return (
    <Row className="relative p-1 px-3 mb-1 rounded-sm bg-secondary w-full gap-x-2 justify-between">
      <Row gap="x-5">
        <DatabaseFilled style={{ color: serie.config.color }} />
        <span>Field:</span>
        <Select
          defaultValue={serie.datasource.field}
          options={options}
          onChange={(opt) =>
            setOptions((e) => {
              e.config.series[index].datasource.field = opt?.value;
            })
          }
        />
      </Row>
      {onDeleteSerie && (
        <CloseOutlined
          className="text-xs flex p-1 rounded hover:bg-primary"
          onClick={() => onDeleteSerie(serie)}
        />
      )}
    </Row>
  );
};
