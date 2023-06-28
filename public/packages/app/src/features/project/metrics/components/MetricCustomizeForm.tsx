import { CustomizeFormSection } from "./CustomizeFormSection";
import { IMetric, DeepPartial, UplotDataType, MetricType } from "@traceo/types";
import { FieldLabel } from "@traceo/ui";
import { FC, useMemo } from "react";
import { DraftFunction } from "use-immer";
import { editMetricBasicForm } from "./editMetricBasicForm";
import { TimeseriesForm } from "./Forms/TimeseriesForm";
import { HistogramForm } from "./Forms/HistogramForm";
import styled from "styled-components";

interface Props {
  data?: UplotDataType;
  options: DeepPartial<IMetric>;
  setOptions: (arg: DeepPartial<IMetric> | DraftFunction<DeepPartial<IMetric>>) => void;
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

export const MetricCustomizeForm: FC<Props> = (props: Props) => {
  const [basicOptions] = useMemo(() => [editMetricBasicForm(props)], [props.options]);

  const renderForm = () => {
    const metricType = props.options.type;

    switch (metricType) {
      case MetricType.TIME_SERIES:
        return <TimeseriesForm {...props} />;
      case MetricType.HISTOGRAM:
        return <HistogramForm {...props} />;
      default:
        return <TimeseriesForm {...props} />;
    }
  };

  return (
    <Container>
      <Header>Customize graph</Header>
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
