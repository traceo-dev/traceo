import { ArrowLeftOutlined } from "@ant-design/icons";
import { VitalsEnum, VitalsResponse } from "@traceo/types";
import { Card, PageHeader, Space, Typography } from "@traceo/ui";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Page } from "src/core/components/Page";
import { useRequest } from "src/core/hooks/useRequest";
import { useTimeRange } from "src/core/hooks/useTimeRange";
import { MetricTimeRangePicker } from "../../metrics/components/MetricTimeRangePicker";
import { VITALS_DETAILS } from "./types";
import { renderChart } from "./VitalsChart";
import { VitalsRawData } from "./VitalsRawData";

const VitalsPreviewPage = () => {
  const { id, name } = useParams();
  const { ranges, setRanges } = useTimeRange({
    from: dayjs().subtract(24, "h").unix(),
    to: dayjs().unix()
  });

  const { data, isLoading, execute } = useRequest<VitalsResponse>({
    url: `/api/performance/vitals/bins/${id}`,
    params: {
      from: ranges[0],
      to: ranges[1],
      fields: [name]
    }
  });

  useEffect(() => {
    execute();
  }, [ranges]);

  const details = VITALS_DETAILS.find((v) => v.field === name);

  return (
    <Page>
      <PageHeader
        className="mb-5"
        title={
          <Space direction="vertical" className="gap-0 w-full">
            <Space className="max-w-min text-2xs cursor-pointer font-semibold text-primary rounded-lg py-0 hover:text-white">
              <ArrowLeftOutlined />
              <Typography size="xxs" weight="semibold">
                PERFORMANCE
              </Typography>
            </Space>
            <span className="text-white text-3xl font-semibold">{details.name}</span>
            <Typography className="pt-2">{details.description}</Typography>
          </Space>
        }
      />
      <Page.Content>
        <Card
          title="Graph"
          extra={<MetricTimeRangePicker ranges={ranges} setRanges={setRanges} />}
        >
          {renderChart({ data: data[name], field: name as VitalsEnum, isLoading })}
        </Card>
        <VitalsRawData />
      </Page.Content>
    </Page>
  );
};

export default VitalsPreviewPage;
