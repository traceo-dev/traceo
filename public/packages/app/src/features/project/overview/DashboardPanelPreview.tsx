import { Page } from "../../../core/components/Page";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import { conditionClass } from "../../../core/utils/classes";
import {
  DeepPartial,
  ApiResponse,
  MemberRole,
  DashboardPanel as DashboardPanelType
} from "@traceo/types";
import { Button, Row } from "@traceo/ui";
import { useEffect, useState } from "react";
import { To, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import { Permissions } from "../../../core/components/Permissions";
import { useReactQuery } from "../../../core/hooks/useReactQuery";
import { CheckOutlined, SettingOutlined } from "@ant-design/icons";
import { isEmptyObject } from "../../../core/utils/object";
import { TraceoLoading } from "../../../core/components/TraceoLoading";
import api from "../../../core/lib/api";
import { PreviewPageHeader } from "../../../core/components/PreviewPageHeader";
import { OptionsCollapseGroup } from "../explore/components/OptionsCollapseGroup";
import { notify } from "../../../core/utils/notify";
import { BaseMetricChart } from "../../../core/components/UPlot/BaseMetricChart";
import { PanelCustomizeForm } from "./components/PanelCustomizeForm";
import { MetricTableWrapper } from "./components/MetricTableWrapper";
import { MetricTimeToolbar } from "./components/MetricTimeToolbar";
import { ContentCard } from "../../../core/components/ContentCard";
import { RemovePanelConfirm } from "./components/RemovePanelConfirm";
import { getXAxisFormatter } from "./panels/formatters";
import { useDashboard } from "src/core/hooks/useDashboard";
import { useAppDispatch } from "src/store/index";
import { loadDashboard } from "./state/actions";

export const DashboardPanelPreview = () => {
  const dispatch = useAppDispatch();
  const { panelId, id, did } = useParams();

  const { ranges, setRanges } = useTimeRange();
  const { dashboard } = useDashboard();

  const [options, setOptions] = useImmer<DeepPartial<DashboardPanelType>>(undefined);

  const [isCustomizeMode, setCustomizeMode] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const isCustomPanel = options?.type === "custom";
  const isTimePicker = isCustomPanel && !isCustomizeMode;

  const { data, refetch, isLoading, isRefetching } = useReactQuery<any>({
    queryKey: [`metric_ds_${panelId}`],
    url: `/api/metrics/${id}/preview/${panelId}`,
    params: {
      from: ranges[0],
      to: ranges[1]
    }
  });

  const {
    data: rawData = [],
    refetch: refetchRawData,
    isLoading: isLoadingRawData,
    isRefetching: isRefetchinRawData
  } = useReactQuery<any>({
    queryKey: [`metric_ds_raw_${panelId}`],
    url: `/api/metrics/${panelId}/raw-data`,
    params: {
      from: ranges[0],
      to: ranges[1],
      panelId
    }
  });

  useEffect(() => {
    dispatch(loadDashboard(did));
  }, []);

  useEffect(() => {
    refetch();
    refetchRawData();
  }, [ranges, panelId]);

  useEffect(() => {
    if (data && data.options) {
      setOptions(data.options);
    }
  }, [data]);

  if (!options || isEmptyObject(options)) {
    return <TraceoLoading />;
  }

  const onSave = async () => {
    if (!options.title) {
      notify.error("Metric name is required.");
      return;
    }

    const series = options.config.series;
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

    const props = {
      ...options,
      dashboardId: did,
      panelId
    };

    await api.patch<ApiResponse<string>>(`/api/dashboard/panel`, props).finally(() => {
      refetch();
      setSaveLoading(false);
      setCustomizeMode && setCustomizeMode(false);
    });
  };

  const onDiscard = () => {
    setOptions(data.options);
    setCustomizeMode(false);
  };

  const backOpts: To = {
    pathname: `/project/${id}/dashboard/${did}`,
    search: `?from=${ranges[0]}&to=${ranges[1]}`
  };

  const getTableFields = () =>
    options?.config.series.filter(({ show }) => show).map(({ field }) => field);

  const renderOperationButtons = () => {
    if (isCustomizeMode) {
      return (
        <Row gap="x-3">
          <Button
            icon={<CheckOutlined />}
            loading={saveLoading}
            variant="primary"
            size="sm"
            onClick={() => onSave()}
          >
            Update
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDiscard()}>
            Cancel
          </Button>
        </Row>
      );
    }

    return (
      <Row gap="x-3">
        {isCustomPanel && (
          <Permissions statuses={[MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER]}>
            <Button size="sm" onClick={() => setCustomizeMode(true)} icon={<SettingOutlined />}>
              Configure
            </Button>
          </Permissions>
        )}

        {!dashboard.isBase && (
          <RemovePanelConfirm panelId={panelId}>
            <Button size="sm" variant="danger">
              Remove
            </Button>
          </RemovePanelConfirm>
        )}
      </Row>
    );
  };

  return (
    <Page
      isLoading={isLoading}
      header={{
        title: (
          <PreviewPageHeader
            page="panel preview"
            title={options.title}
            description={options.description}
            backOpts={backOpts}
          />
        ),
        suffix: renderOperationButtons()
      }}
    >
      <Page.Content className="pt-0">
        <div className="w-full grid grid-cols-12">
          <div className={conditionClass(isCustomizeMode, "col-span-8 mr-1", "col-span-12")}>
            <ContentCard
              name="Graph"
              loading={isLoading || isRefetching}
              extra={isTimePicker && <MetricTimeToolbar ranges={ranges} setRanges={setRanges} />}
            >
              <BaseMetricChart
                xFormatter={getXAxisFormatter(options.type)}
                datasource={data?.datasource}
                panel={options}
                onZoom={setRanges}
              />
            </ContentCard>

            <OptionsCollapseGroup
              title="Raw data"
              loading={isLoadingRawData || isRefetchinRawData}
              extra={
                <span className="text-xs font-semibold text-primary">
                  {(rawData || []).length} rows found
                </span>
              }
            >
              <MetricTableWrapper
                fields={getTableFields()}
                metricData={rawData}
                isLoading={isLoadingRawData || isRefetchinRawData}
              />
            </OptionsCollapseGroup>
          </div>
          {isCustomizeMode && (
            <div className="col-span-4">
              <PanelCustomizeForm
                data={data?.datasource}
                setOptions={setOptions}
                options={options}
              />
            </div>
          )}
        </div>
      </Page.Content>
    </Page>
  );
};

export default DashboardPanelPreview;
