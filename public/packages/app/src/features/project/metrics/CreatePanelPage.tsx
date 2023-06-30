import { Page } from "../../../core/components/Page";
import {
  ApiResponse,
  Dashboard,
  DashboardPanel,
  IMetric,
  IMetricOptions,
  IMetricSerie,
  METRIC_UNIT,
  MetricType,
  PANEL_TYPE
} from "@traceo/types";
import { DeepPartial } from "redux";
import { useImmer } from "use-immer";
import { Button, Card, Row } from "@traceo/ui";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { MetricCustomizeForm } from "./components/MetricCustomizeForm";
import { randomHexColor } from "../../../core/utils/colors";
import { DataNotFound } from "../../../core/components/DataNotFound";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../core/lib/api";
import { notify } from "../../../core/utils/notify";
import dayjs from "dayjs";
import { PreviewPageHeader } from "../../../core/components/PreviewPageHeader";
import { CheckOutlined } from "@ant-design/icons";
import dateUtils from "src/core/utils/date";

const initialMetric: DeepPartial<IMetric> = {
  name: "New panel",
  type: MetricType.TIME_SERIES,
  description: "New panel description",
  config: {
    histogram: {
      bucket: {
        size: 5,
        offset: 0
      },
      min: 1,
      max: undefined
    },
    stack: {
      show: false,
      strategy: "samesign"
    },
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
        barWidth: 50,
        color: randomHexColor(),
        lineWidth: 1,
        type: "line"
      },
      name: "New serie",
      description: "New serie description",
      field: undefined,
      unit: METRIC_UNIT.NONE,
      show: true
    }
  ],
  // internal: false,
  show: true,
  unit: METRIC_UNIT.NONE
};

const CreatePanelPage = () => {
  const { id, did } = useParams();

  const navigate = useNavigate();

  const [options, setOptions] = useImmer<DeepPartial<IMetric>>(initialMetric);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const onCreate = async () => {
    if (!options.name) {
      notify.error("Panel name is required.");
      return;
    }

    const series = options.series;
    if (series.length === 0) {
      notify.error("You have to add at least one serie to this metric.");
      return;
    }

    const missingName = series.find((serie) => !serie?.name);
    if (missingName) {
      notify.error("Your metric serie does not have a required name value.");
      return;
    }

    const missingField = series.find((serie) => !serie?.field);
    if (missingField) {
      notify.error("Your metric serie does not have a required field value.");
      return;
    }

    setSaveLoading(true);

    // DashboardPanel
    const config = {
      title: options.name,
      description: options?.description,
      dashboardId: did,
      gridPosition: {
        w: 8,
        h: 6,
        x: 0,
        y: 0
      },
      // TODO:
      type: PANEL_TYPE.TIME_SERIES,
      createdAt: dateUtils.toUnix(),
      config: {
        series: options.series as IMetricSerie[],
        options: options.config as IMetricOptions,
        unit: options.unit
      }
    };

    await api
      .post<ApiResponse<DashboardPanel>>(`/api/dashboard/panel`, config)
      .then((resp) => {
        if (resp.status === "success") {
          navigate({
            pathname: `/project/${id}/dashboard/${did}`
          });
        }
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const onCancel = () => {
    navigate(`/project/${id}/dashboard/${did}`);
  };

  return (
    <Page
      header={{
        title: (
          <PreviewPageHeader
            page="metrics"
            title={options.name}
            description={options.description}
          />
        ),
        suffix: (
          <Row className="ustify-end" gap="x-3">
            <Button
              icon={<CheckOutlined />}
              loading={saveLoading}
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
        )
      }}
    >
      <Page.Content className="pt-0">
        <div className="w-full grid grid-cols-12">
          <div className="col-span-8 mr-1">
            <Card title={options.name}>
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
          <div className="col-span-4">
            <MetricCustomizeForm data={[[]]} setOptions={setOptions} options={options} />
          </div>
        </div>
      </Page.Content>
    </Page>
  );
};

export default CreatePanelPage;
