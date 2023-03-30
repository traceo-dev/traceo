import { LoadingOutlined, RocketOutlined } from "@ant-design/icons";
import { VitalsEnum, VitalsResponse } from "@traceo/types";
import { Card } from "@traceo/ui";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { ColumnSection } from "../../../core/components/ColumnSection";
import { Page } from "../../../core/components/Page";
import { SearchWrapper } from "../../../core/components/SearchWrapper";
import { useRequest } from "../../../core/hooks/useRequest";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import { MetricTimeRangePicker } from "../metrics/components/MetricTimeRangePicker";
import { VITALS_DETAILS } from "./vitals/types";
import { VitalsChart } from "./vitals/VitalsChart";

const SUPPORTED_WEB_VITALS = [
  VitalsEnum.CLS,
  VitalsEnum.FCP,
  VitalsEnum.FID,
  VitalsEnum.FP,
  VitalsEnum.LCP
];

const PerformancePage = () => {
  const { id } = useParams();
  const { ranges, setRanges } = useTimeRange({
    from: dayjs().subtract(24, "h").unix(),
    to: dayjs().unix()
  });

  const { data, isLoading } = useRequest<VitalsResponse>({
    url: `/api/performance/vitals/${id}`,
    params: {
      from: ranges[0],
      to: ranges[1],
      fields: SUPPORTED_WEB_VITALS
    }
  });

  return (
    <Page
      header={{
        title: "Performance",
        icon: <RocketOutlined />,
        description:
          "A collection of data about the performance of your application. It is based on scrapped web-vitals data from browser."
      }}
    >
      <Card>
        <SearchWrapper className="justify-end">
          <MetricTimeRangePicker ranges={ranges} setRanges={setRanges} />
        </SearchWrapper>
      </Card>
      <div className="flex flex-col">
        {VITALS_DETAILS.map(({ description, field, name }, key) => (
          <Card className="mb-1" key={key}>
            <ColumnSection title={name} subtitle={description}>
              {isLoading || !data ? (
                <LoadingOutlined />
              ) : (
                <VitalsChart field={field} data={data[field]} />
              )}
            </ColumnSection>
          </Card>
        ))}
      </div>
    </Page>
  );
};

export default PerformancePage;
