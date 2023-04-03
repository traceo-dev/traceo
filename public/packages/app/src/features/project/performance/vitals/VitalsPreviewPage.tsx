import { QuestionCircleOutlined } from "@ant-design/icons";
import { VitalsEnum, Performance, VitalsHealthType } from "@traceo/types";
import { Card, InputSearch, PageHeader, Select } from "@traceo/ui";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { HrefIcon } from "../../../../core/components/HrefIcon";
import { PreviewPageHeader } from "src/core/components/PreviewPageHeader";
import { Page } from "../../../../core/components/Page";
import { SearchWrapper } from "../../../../core/components/SearchWrapper";
import { useRequest } from "../../../../core/hooks/useRequest";
import { useTimeRange } from "../../../../core/hooks/useTimeRange";
import { MetricTimeRangePicker } from "../../metrics/components/MetricTimeRangePicker";
import { selectHealthOptions, VITALS_DETAILS, WEB_VITALS_DOCS_URL } from "./types";
import { parseToBins } from "./utils";
import { renderChart } from "./VitalsChart";
import { VitalsGraphBar } from "./VitalsGraphBar";
import { VitalsHealthBar } from "./VitalsHealthBar";
import { VitalsRawData } from "./VitalsRawData";

const VitalsPreviewPage = () => {
  const { id, name } = useParams();

  const [selectedHealth, setSelectedHealth] = useState<VitalsHealthType>(undefined);
  const [search, setSearch] = useState<string>(undefined);

  const { ranges, setRanges } = useTimeRange({
    from: dayjs().subtract(24, "h").unix(),
    to: dayjs().unix()
  });

  useEffect(() => {
    window.scrollTo(window.scrollX, 0);
  }, []);

  const {
    data: performances = [],
    isLoading,
    execute
  } = useRequest<Performance[]>({
    url: `/api/performance/vitals/${id}`,
    params: {
      from: ranges[0],
      to: ranges[1],
      fields: [name],
      health: selectedHealth,
      search
    }
  });

  useEffect(() => {
    execute();
  }, [ranges, selectedHealth, search]);

  const dataSource = useMemo(() => {
    return parseToBins(performances);
  }, [performances]);

  const details = VITALS_DETAILS.find((v) => v.field === name);

  const onKeyDown = (event: any) => event.keyCode === 13 && setSearch(event.target.value);

  return (
    <Page>
      <PageHeader
        className="mb-5"
        suffix={<HrefIcon href={WEB_VITALS_DOCS_URL[name]} icon={<QuestionCircleOutlined />} />}
        title={
          <PreviewPageHeader
            page="performance"
            title={details.name}
            description={details.description}
          />
        }
      />
      <Page.Content>
        <Card>
          <SearchWrapper>
            <InputSearch
              onKeyDown={onKeyDown}
              placeholder="Search event by browser, platform or view"
              value={search}
            />
            <Select
              isClearable
              value={selectedHealth}
              placeholder="Select health"
              options={selectHealthOptions}
              onChange={(opt) => setSelectedHealth(opt?.value)}
            />
            <MetricTimeRangePicker ranges={ranges} setRanges={setRanges} />
          </SearchWrapper>
        </Card>
        <Card title="Graph" extra={<VitalsGraphBar name={name} performances={performances} />}>
          {renderChart({
            data: dataSource,
            field: name as VitalsEnum,
            isLoading: isLoading
          })}
        </Card>
        <VitalsHealthBar list={performances} />
        <VitalsRawData isLoading={isLoading} performances={performances} />
      </Page.Content>
    </Page>
  );
};

export default VitalsPreviewPage;
