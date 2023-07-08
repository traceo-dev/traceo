import { Page } from "../../../core/components/Page";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import { conditionClass } from "../../../core/utils/classes";
import {
  ApiResponse,
  MemberRole,
  DashboardPanel as DashboardPanelType,
  VISUALIZATION_TYPE
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
import { PanelDatasourceTable } from "./components/PanelDatasourceTable";
import { MetricTimeToolbar } from "./components/Toolbars/MetricTimeToolbar";
import { RemovePanelConfirm } from "./components/RemovePanelConfirm";
import { useDashboard } from "../../../core/hooks/useDashboard";
import { useAppDispatch } from "../../../store/index";
import { loadDashboard } from "./state/actions";
import { PanelCustomizeForm } from "./components/PanelEditor/PanelCustomizeForm";
import { getVisualizationComponent, validate } from "./utils";
import { usePanelQuery } from "./components/Panels/usePanelQuery";
import { mapVisualizationName } from "./components/utils";
import { PanelProps } from "./components/Panels/types";

export const PanelPreviewPage = () => {
  const dispatch = useAppDispatch();

  const { panelId, id, dashboardId } = useParams();
  const { dashboard } = useDashboard();
  const { ranges, setRanges } = useTimeRange();
  const { data, refetch } = usePanelQuery(panelId, ranges);

  const [options, setOptions] = useImmer<DashboardPanelType>(undefined);
  const [isCustomizeMode, setCustomizeMode] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const isCustomPanel = options?.type === "custom";
  const visualization = options?.config.visualization;

  const isTimePicker =
    ![VISUALIZATION_TYPE.STAT, VISUALIZATION_TYPE.TEXT].includes(visualization) &&
    isCustomPanel &&
    !isCustomizeMode;

  const isRawDataPreview = ![VISUALIZATION_TYPE.STAT, VISUALIZATION_TYPE.TEXT].includes(
    visualization
  );

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

  const renderPanel = () => {
    const visualization = options.config.visualization;

    const props: PanelProps = {
      title: mapVisualizationName[visualization],
      isEditable: false,
      isRemoveMode: false,
      isHoverOptions: false,
      panel: options,
      ranges: ranges,
      onChangeTimeRange: setRanges
    };

    if (isTimePicker) {
      props.options = <MetricTimeToolbar ranges={ranges} setRanges={setRanges} />;
    }

    return getVisualizationComponent(visualization, props);
  };

  return (
    <Page
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
            {renderPanel()}
            {isRawDataPreview && (
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
            )}
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
