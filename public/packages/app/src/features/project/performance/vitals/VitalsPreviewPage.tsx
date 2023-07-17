import { QuestionCircleOutlined } from "@ant-design/icons";
import { VitalsEnum, Performance, VitalsHealthType } from "@traceo/types";
import { Card, InputSearch, Select } from "@traceo/ui";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { HrefIcon } from "../../../../core/components/HrefIcon";
import { PreviewPageHeader } from "../../../../core/components/PreviewPageHeader";
import { Page } from "../../../../core/components/Page";
import { SearchWrapper } from "../../../../core/components/SearchWrapper";
import { useTimeRange } from "../../../../core/hooks/useTimeRange";
import { selectHealthOptions, VITALS_DETAILS, WEB_VITALS_DOCS_URL } from "./types";
import { parseToBins } from "./utils";
import { renderChart } from "./VitalsChart";
import { VitalsGraphBar } from "./VitalsGraphBar";
import { VitalsHealthBar } from "./VitalsHealthBar";
import { VitalsRawData } from "./VitalsRawData";
import { useReactQuery } from "../../../../core/hooks/useReactQuery";
import { ContentCard } from "../../../../core/components/ContentCard";
import { Portal } from "src/core/components/Portal";
import { ToolbarTimePicker } from "../../../../core/components/ToolbarTimePicker";

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
    isFetching,
    refetch
  } = useReactQuery<Performance[]>({
    queryKey: [`vitals_${id}`],
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
    refetch();
  }, [ranges, selectedHealth, search]);

  const dataSource = useMemo(() => {
    return parseToBins(performances);
  }, [performances]);

  const details = VITALS_DETAILS.find((v) => v.field === name);

  const onKeyDown = (event: any) => event.keyCode === 13 && setSearch(event.target.value);

  return (
    <Page
      header={{
        title: (
          <PreviewPageHeader
            page="performance"
            title={details.name}
            description={details.description}
          />
        ),
        suffix: <HrefIcon href={WEB_VITALS_DOCS_URL[name]} icon={<QuestionCircleOutlined />} />
      }}
    >
      <Portal id="dashboard-toolbar">
        <ToolbarTimePicker ranges={ranges} onChangeRanges={setRanges} />
      </Portal>
      <Page.Content className="pt-1">
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
          </SearchWrapper>
        </Card>
        <ContentCard
          name="Graph"
          extra={<VitalsGraphBar name={name} performances={performances} />}
        >
          {renderChart({
            data: dataSource,
            field: name as VitalsEnum,
            isLoading: isFetching
          })}
        </ContentCard>
        <VitalsHealthBar list={performances} />
        <VitalsRawData isLoading={isFetching} performances={performances} />
      </Page.Content>
    </Page>
  );
};

export default VitalsPreviewPage;
