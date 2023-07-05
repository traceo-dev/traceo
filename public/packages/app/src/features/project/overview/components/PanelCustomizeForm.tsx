import { CustomizeFormSection } from "./CustomizeFormSection";
import { DeepPartial, UplotDataType, DashboardPanel, VISUALIZATION_TYPE } from "@traceo/types";
import { FieldLabel, SelectOptionProps } from "@traceo/ui";
import { FC, useMemo } from "react";
import { DraftFunction } from "use-immer";
import { editMetricBasicForm } from "./editMetricBasicForm";
import { TimeseriesForm } from "./Forms/TimeseriesForm";
import { HistogramForm } from "./Forms/HistogramForm";
import styled from "styled-components";
import { useReactQuery } from "../../../../core/hooks/useReactQuery";
import { useParams } from "react-router-dom";

interface Props {
  data?: UplotDataType;
  options: DeepPartial<DashboardPanel>;
  setOptions: (
    arg: DeepPartial<DashboardPanel> | DraftFunction<DeepPartial<DashboardPanel>>
  ) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-primary);
  position: relative;
  border: 1px solid var(--color-bg-secondary);
  border-radius: 4px;
`;

const Header = styled.span`
  width: 100%;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-inline: 8px;
  font-weight: 500;
  font-size: 14px;
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-bg-secondary);
`;

export const PanelCustomizeForm: FC<Props> = (props: Props) => {
  const { id } = useParams();
  const [basicOptions] = useMemo(() => [editMetricBasicForm(props)], [props.options]);

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
      [VISUALIZATION_TYPE.GAUGE]: undefined
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
