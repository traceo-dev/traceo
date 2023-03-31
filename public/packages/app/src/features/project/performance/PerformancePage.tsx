import { LoadingOutlined, RocketOutlined } from "@ant-design/icons";
import { VitalsEnum, VitalsResponse } from "@traceo/types";
import { Card, Space } from "@traceo/ui";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { DataNotFound } from "src/core/components/DataNotFound";
import { ColumnSection } from "../../../core/components/ColumnSection";
import { Page } from "../../../core/components/Page";
import { SearchWrapper } from "../../../core/components/SearchWrapper";
import { useRequest } from "../../../core/hooks/useRequest";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import { MetricTimeRangePicker } from "../metrics/components/MetricTimeRangePicker";
import { VITALS_DETAILS } from "./vitals/types";
import { calculateVitalsAvg } from "./vitals/utils";
import { VitalsChart } from "./vitals/VitalsChart";

const SUPPORTED_WEB_VITALS = [
  VitalsEnum.CLS,
  VitalsEnum.FCP,
  VitalsEnum.FID,
  VitalsEnum.FP,
  VitalsEnum.LCP
];

const WEB_VITALS_DOCS_URL: Record<VitalsEnum, string> = {
  [VitalsEnum.CLS]: "https://web.dev/cls/",
  [VitalsEnum.FCP]: "https://web.dev/fcp/",
  [VitalsEnum.FID]: "https://web.dev/fid/",
  [VitalsEnum.FP]: "https://developer.mozilla.org/en-US/docs/Glossary/First_paint",
  [VitalsEnum.LCP]: "https://web.dev/lcp/"
};

const PerformancePage = () => {
  const { id } = useParams();
  const { ranges, setRanges } = useTimeRange({
    from: dayjs().subtract(24, "h").unix(),
    to: dayjs().unix()
  });

  const { data, isLoading, execute } = useRequest<VitalsResponse>({
    url: `/api/performance/vitals/${id}`,
    params: {
      from: ranges[0],
      to: ranges[1],
      fields: SUPPORTED_WEB_VITALS
    }
  });

  useEffect(() => {
    execute();
  }, [ranges]);

  const renderChart = (field: VitalsEnum) => {
    if (isLoading) {
      return (
        <Space className="w-full justify-center flex flex-col">
          <LoadingOutlined className="mt-12" />
          <span>Loading...</span>
        </Space>
      );
    }

    if (!data || !data[field]) {
      return <DataNotFound className="mt-12" label="Performance data not found" />;
    }

    return (
      <Space className="w-full justify-center">
        <VitalsChart field={field} data={data[field]} />
      </Space>
    );
  };

  const renderAvg = (field: VitalsEnum) => {
    if (isLoading || !data) {
      return <LoadingOutlined />;
    }

    return calculateVitalsAvg(field, data[field]);
  };

  const subtitle = (field: VitalsEnum, description: string) => {
    return (
      <div className="flex flex-col w-full">
        <span className="text-5xl font-semibold my-3">{renderAvg(field)}</span>
        <span>{description}</span>
        <a target="_blank" href={WEB_VITALS_DOCS_URL[field]} className="mt-5 text-xs text-sky-500 font-semibold">
          Read more
        </a>
      </div>
    );
  };

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
      <div className="flex flex-col w-full">
        {VITALS_DETAILS.map(({ description, field, name }, key) => (
          <Card className="mb-1" key={key}>
            <ColumnSection title={name} subtitle={subtitle(field, description)}>
              {renderChart(field)}
            </ColumnSection>
          </Card>
        ))}
      </div>
    </Page>
  );
};

export default PerformancePage;
