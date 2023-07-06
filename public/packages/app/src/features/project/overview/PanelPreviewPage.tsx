import { Page } from "../../../core/components/Page";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import { conditionClass } from "../../../core/utils/classes";
import {
  ApiResponse,
  MemberRole,
  DashboardPanel as DashboardPanelType,
  UplotDataType
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
import { PanelDatasourceTable } from "./components/PanelDatasourceTable";
import { MetricTimeToolbar } from "./components/Toolbars/MetricTimeToolbar";
import { ContentCard } from "../../../core/components/ContentCard";
import { RemovePanelConfirm } from "./components/RemovePanelConfirm";
import { useDashboard } from "../../../core/hooks/useDashboard";
import { useAppDispatch } from "../../../store/index";
import { loadDashboard } from "./state/actions";
import { PanelCustomizeForm } from "./components/PanelEditor/PanelCustomizeForm";
import { getXAxisFormatter } from "./components/Panels/formatters";
import { validate } from "./utils";

type QueryResponseType = {
  options: DashboardPanelType;
  datasource: UplotDataType;
};
export const PanelPreviewPage = () => {
  const dispatch = useAppDispatch();
  const { panelId, id, dashboardId } = useParams();

  const { ranges, setRanges } = useTimeRange();
  const { dashboard } = useDashboard();

  const [options, setOptions] = useImmer<DashboardPanelType>(undefined);

  const [isCustomizeMode, setCustomizeMode] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const isCustomPanel = options?.type === "custom";
  const isTimePicker = isCustomPanel && !isCustomizeMode;

  const { data, refetch, isLoading, isRefetching } = useReactQuery<QueryResponseType>({
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
  } = useReactQuery<[]>({
    queryKey: [`metric_ds_raw_${panelId}`],
    url: `/api/metrics/${panelId}/raw-data`,
    params: {
      from: ranges[0],
      to: ranges[1],
      panelId
    }
  });

  useEffect(() => {
    dispatch(loadDashboard(dashboardId));
  }, []);

  useEffect(() => {
    if (data && data.options) {
      setOptions(data.options);
    }
  }, [data, panelId]);

  useEffect(() => {
    refetch();
    refetchRawData();
  }, [ranges]);

  if (!options || isEmptyObject(options)) {
    return <TraceoLoading />;
  }

  const onSave = async () => {
    const errors = validate(options);
    if (errors.length > 0) {
      notify.error(errors[0]);
      return;
    }

    setSaveLoading(true);

    const props = {
      ...options,
      dashboardId: dashboardId,
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
    pathname: `/project/${id}/dashboard/${dashboardId}`,
    search: `?from=${ranges[0]}&to=${ranges[1]}`
  };

  const getTableFields = () => options?.config.series.map(({ field }) => field);

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
              <PanelDatasourceTable
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

export default PanelPreviewPage;
