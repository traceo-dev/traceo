import { EyeOutlined, LoadingOutlined, RocketOutlined } from "@ant-design/icons";
import { VitalsEnum, VitalsResponse } from "@traceo/types";
import { Alert, Card } from "@traceo/ui";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ColumnSection } from "../../../core/components/ColumnSection";
import { Page } from "../../../core/components/Page";
import { SearchWrapper } from "../../../core/components/SearchWrapper";
import { useRequest } from "../../../core/hooks/useRequest";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import { MetricTimeRangePicker } from "../metrics/components/MetricTimeRangePicker";
import { VITALS_DETAILS } from "./vitals/types";
import { calculateVitalsAvg } from "./vitals/utils";
import { renderChart } from "./vitals/VitalsChart";

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
  const navigate = useNavigate();
  const { ranges, setRanges } = useTimeRange({
    from: dayjs().subtract(24, "h").unix(),
    to: dayjs().unix()
  });

  const { data, isLoading, execute } = useRequest<VitalsResponse>({
    url: `/api/performance/vitals/bins/${id}`,
    params: {
      from: ranges[0],
      to: ranges[1],
      fields: SUPPORTED_WEB_VITALS
    }
  });

  useEffect(() => {
    execute();
  }, [ranges]);

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
        <a
          target="_blank"
          href={WEB_VITALS_DOCS_URL[field]}
          className="mt-5 text-xs text-sky-500 font-semibold"
        >
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
      <Alert
        type="warning"
        title="Beta"
        message="At this point, the performance feature is being tested. Please report potential bugs on the Github Issue."
      />
      <Card>
        <SearchWrapper className="justify-end">
          <MetricTimeRangePicker ranges={ranges} setRanges={setRanges} />
        </SearchWrapper>
      </Card>
      <div className="flex flex-col w-full">
        {VITALS_DETAILS.map(({ description, field, name }, key) => (
          <Card
            className="mb-1 flex flex-col"
            title={
              <span
                className="cursor-pointer font-semibold"
                onClick={() => navigate(`/project/${id}/performance/${field}`)}
              >
                {name}
              </span>
            }
            key={key}
          >
            <ColumnSection subtitle={subtitle(field, description)}>
              {renderChart({ data, field, isLoading })}
            </ColumnSection>
          </Card>
        ))}
      </div>
    </Page>
  );
};

export default PerformancePage;
