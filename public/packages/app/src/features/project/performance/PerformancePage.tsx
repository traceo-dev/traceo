import { LoadingOutlined, RocketOutlined } from "@ant-design/icons";
import { VitalsEnum, VitalsResponse } from "@traceo/types";
import { Alert, Card } from "@traceo/ui";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReactQuery } from "../../../core/hooks/useReactQuery";
import { ColumnSection } from "../../../core/components/ColumnSection";
import { Page } from "../../../core/components/Page";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import { VITALS_DETAILS, WEB_VITALS_DOCS_URL } from "./vitals/types";
import { calculateVitalsAvg } from "./vitals/utils";
import { renderChart } from "./vitals/VitalsChart";
import { Portal } from "src/core/components/Portal";
import { ToolbarTimePicker } from "../../../core/components/ToolbarTimePicker";

const SUPPORTED_WEB_VITALS = [
  VitalsEnum.CLS,
  VitalsEnum.FCP,
  VitalsEnum.FID,
  VitalsEnum.FP,
  VitalsEnum.LCP
];

const PerformancePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ranges, setRanges } = useTimeRange({
    from: dayjs().subtract(24, "h").unix(),
    to: dayjs().unix()
  });

  const { data, isFetching, refetch } = useReactQuery<VitalsResponse>({
    queryKey: ["vitals"],
    url: `/api/performance/vitals/bins/${id}`,
    params: { from: ranges[0], to: ranges[1], fields: SUPPORTED_WEB_VITALS }
  });

  useEffect(() => {
    refetch();
  }, [ranges]);

  const renderAvg = (field: VitalsEnum) => {
    if (isFetching) {
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

  const onClick = (field: VitalsEnum) => {
    navigate({
      pathname: `/project/${id}/performance/${field}`,
      search: `?from=${ranges[0]}&to=${ranges[1]}`
    });
  };

  return (
    <Page
      header={{
        title: "Performance",
        icon: <RocketOutlined />,
        description:
          "A collection of data about the performance of your application. It is based on scrapped web-vitals data from browser."
      }}
      headerDivider={true}
    >
      <Portal id="dashboard-toolbar">
        <ToolbarTimePicker ranges={ranges} onChangeRanges={setRanges} />
      </Portal>
      <Page.Content className="pt-5">
        <div className="flex flex-col w-full">
          {VITALS_DETAILS.map(({ description, field, name }, key) => (
            <Card
              className="mb-1 flex flex-col"
              onClick={() => onClick(field)}
              title={name}
              key={key}
            >
              <ColumnSection subtitle={subtitle(field, description)}>
                {renderChart({ data, field, isLoading: isFetching })}
              </ColumnSection>
            </Card>
          ))}
        </div>
      </Page.Content>
    </Page>
  );
};

export default PerformancePage;
