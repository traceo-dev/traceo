import { CustomizeFormSection } from "./CustomizeFormSection";
import { UplotDataType, DashboardPanel, VISUALIZATION_TYPE } from "@traceo/types";
import { FieldLabel, SelectOptionProps } from "@traceo/ui";
import { FC, useMemo } from "react";
import { DraftFunction } from "use-immer";
import { editPanelBasicForm } from "./editPanelBasicForm";
import { useReactQuery } from "../../../../../core/hooks/useReactQuery";
import { useParams } from "react-router-dom";
import { HistogramForm } from "./HistogramForm";
import { TimeseriesForm } from "./TimeseriesForm";
import { Header, Container } from "./components";
import { TextForm } from "./TextForm";

interface Props {
  data?: UplotDataType;
  options: DashboardPanel;
  setOptions: (arg: DashboardPanel | DraftFunction<DashboardPanel>) => void;
}

export const PanelCustomizeForm: FC<Props> = (props: Props) => {
  const { id } = useParams();
  const [basicOptions] = useMemo(() => [editPanelBasicForm(props)], [props.options]);

  const { data: fieldsOptions = [] } = useReactQuery<SelectOptionProps[]>({
    queryKey: [`panels_fields_key`],
    url: `/api/metrics/fields/${id}`
  });

  const renderForm = () => {
    const panelType = props.options.type;
    const visualization = props.options.config.visualization;

    const formProps = {
      ...props,
      serieFieldOptions: fieldsOptions
    };

    const visualizationComponent: Record<VISUALIZATION_TYPE, JSX.Element> = {
      [VISUALIZATION_TYPE.TIME_SERIES]: <TimeseriesForm {...formProps} />,
      [VISUALIZATION_TYPE.HISTOGRAM]: <HistogramForm {...formProps} />,
      [VISUALIZATION_TYPE.GAUGE]: undefined,
      [VISUALIZATION_TYPE.STAT]: undefined,
      [VISUALIZATION_TYPE.TEXT]: <TextForm {...formProps} />
    };

    if (panelType === "custom") {
      return visualizationComponent[visualization];
    }

    return undefined;
  };

  return (
    <Container>
      <Header>Customize visualization</Header>
      <div className="max-h-[750px] overflow-y-scroll">
        <CustomizeFormSection title="Basic" defaultCollapsed={false}>
          {basicOptions.map((opt, index) => (
            <FieldLabel
              key={index}
              label={opt.label}
              labelPosition={opt?.labelPosition}
              labelSize="xs"
            >
              {opt.component}
            </FieldLabel>
          ))}
        </CustomizeFormSection>

        {renderForm()}
      </div>
    </Container>
  );
};
