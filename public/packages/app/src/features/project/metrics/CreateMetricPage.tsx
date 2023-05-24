import { Page } from "../../../core/components/Page";
import { MetricPreviewHeader } from "./components/MetricPreviewHeader";
import { IMetric, METRIC_UNIT } from "@traceo/types";
import { DeepPartial } from "redux";
import { useImmer } from "use-immer";
import { Card } from "@traceo/ui";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { MetricCustomizeForm } from "./components/MetricCustomizeForm";
import { randomHexColor } from "../../../core/utils/colors";
import { DataNotFound } from "src/core/components/DataNotFound";

const initialMetric: DeepPartial<IMetric> = {
  name: "New metric",
  description: "New metric description",
  config: {
    legend: {
      show: true,
      orient: "horizontal"
    },
    line: {
      marker: {
        show: false
      }
    },
    tooltip: {
      show: false
    },
    axis: {
      showX: true,
      showY: true,
      showGridLines: true
    }
  },
  series: [
    {
      config: {
        area: {
          opacity: 50,
          show: false
        },
        barWidth: 5,
        color: randomHexColor(),
        lineWidth: 2,
        type: "line"
      },
      name: "New serie",
      description: "New serie description",
      field: undefined,
      unit: METRIC_UNIT.NONE,
      show: true
    }
  ],
  isDefault: false,
  show: true,
  showDescription: true,
  unit: METRIC_UNIT.NONE
};

const CreateMetricPage = () => {
  const [options, setOptions] = useImmer<DeepPartial<IMetric>>(initialMetric);

  return (
    <Page>
      <MetricPreviewHeader
        currentOptions={options}
        isCustomizeMode={true}
        setOptions={setOptions}
        isCreateMode={true}
      />
      <Page.Content>
        <div className="w-full grid grid-cols-12">
          <div className="col-span-8">
            <Card title="Graph">
              <ConditionalWrapper
                isEmpty
                emptyView={
                  <DataNotFound
                    label="Graph preview not available"
                    explanation="Fill in the configuration data for this metric overview and save the new metric to see the preview."
                  />
                }
              />
            </Card>
          </div>
          <MetricCustomizeForm setOptions={setOptions} options={options} />
        </div>
      </Page.Content>
    </Page>
  );
};

export default CreateMetricPage;
