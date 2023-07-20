import { UplotDataType, DashboardPanel, IMetricSerie, VISUALIZATION_TYPE } from "@traceo/types";
import { FieldLabel, SelectOptionProps, Tooltip } from "@traceo/ui";
import { FC } from "react";
import { DraftFunction } from "use-immer";
import { useReactQuery } from "../../../../../core/hooks/useReactQuery";
import { useParams } from "react-router-dom";
import { Header, Container } from "./components";
import { editPanelSerieForm } from "./editPanelSeriesForm";
import { CustomizeFormSerieSection } from "./CustomizeFormSerieSection";
import { randomHexColor } from "../../../../../core/utils/colors";
import { PlusOutlined } from "@ant-design/icons";

interface Props {
  data?: UplotDataType;
  options: DashboardPanel;
  setOptions: (arg: DashboardPanel | DraftFunction<DashboardPanel>) => void;
}

export const PanelSeriesCustomizeForm: FC<Props> = (props: Props) => {
  const { id } = useParams();

  const isHistogram = props.options.config.visualization === VISUALIZATION_TYPE.HISTOGRAM;

  const { data: fieldsOptions = [] } = useReactQuery<SelectOptionProps[]>({
    queryKey: [`panels_fields_key`],
    url: `/api/metrics/fields/${id}`
  });

  const onDeleteSerie = (serie: IMetricSerie) => {
    const newSeries = props.options.config.series.filter((s) => s !== serie);
    props.setOptions((opt) => {
      opt.config.series = newSeries;
    });
  };

  const onAddNewSerie = () => {
    const serie: IMetricSerie = {
      name: "New serie",
      description: undefined,
      config: {
        area: {
          show: false,
          opacity: 50
        },
        barWidth: 5,
        color: randomHexColor(),
        lineWidth: 1,
        type: "line"
      },
      field: undefined
    };

    props.data.push([]);
    props.setOptions((opt) => {
      opt.config.series.push(serie);
    });
  };

  return (
    <Container>
      <Header>
        <span>Datasource series</span>
        {!isHistogram && (
          <Tooltip title="Add new serie">
            <PlusOutlined
              onClick={() => onAddNewSerie()}
              className="flex p-1 hover:bg-secondary cursor-pointer rounded-full"
            />
          </Tooltip>
        )}
      </Header>
      <div className="max-h-[750px] overflow-y-scroll">
        {props.options.config.series.map((serie, index) => {
          const serieProps = {
            index,
            serie: serie as IMetricSerie,
            setOptions: props.setOptions,
            visualization: props.options.config.visualization,
            serieFieldOptions: fieldsOptions,
            panelType: props.options.type
          };

          return (
            <CustomizeFormSerieSection
              key={index}
              serie={serie}
              collapsed={index !== 0}
              onDelete={() => onDeleteSerie(serie as IMetricSerie)}
            >
              {editPanelSerieForm(serieProps).map((opt, index) => (
                <FieldLabel
                  key={index}
                  label={opt.label}
                  labelPosition={opt?.labelPosition}
                  labelSize="xs"
                >
                  {opt.component}
                </FieldLabel>
              ))}
            </CustomizeFormSerieSection>
          );
        })}
      </div>
    </Container>
  );
};
