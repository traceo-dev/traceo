import { Page } from "../../../core/components/Page";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
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
import { SettingOutlined } from "@ant-design/icons";
import { isEmptyObject } from "../../../core/utils/object";
import { TraceoLoading } from "../../../core/components/TraceoLoading";
import api from "../../../core/lib/api";
import { PreviewPageHeader } from "../../../core/components/PreviewPageHeader";
import { notify } from "../../../core/utils/notify";
import { MetricTimeToolbar } from "./components/Toolbars/MetricTimeToolbar";
import { RemovePanelConfirm } from "./components/RemovePanelConfirm";
import { useDashboard } from "../../../core/hooks/useDashboard";
import { useAppDispatch } from "../../../store/index";
import { loadDashboard } from "./state/actions";
import { getVisualizationComponent, validate } from "./utils";
import { usePanelQuery } from "./components/Panels/usePanelQuery";
import { mapVisualizationName } from "./components/utils";
import { PanelProps } from "./components/Panels/types";
import { PanelContent } from "./PanelContent";
import { configureStore } from "@reduxjs/toolkit";

export const PanelPreviewPage = () => {
  const dispatch = useAppDispatch();

  const { panelId, id, dashboardId } = useParams();
  const { dashboard } = useDashboard();
  const { ranges, setRanges } = useTimeRange();
  const { data, refetch } = usePanelQuery(panelId, ranges);

  const [options, setOptions] = useImmer<DashboardPanelType>(undefined);
  const [isCustomizeMode, setCustomizeMode] = useState<boolean>(false);

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
  } = useReactQuery<any[]>({
    queryKey: [`metric_ds_raw_${panelId}`],
    url: `/api/metrics/${id}/raw-data`,
    params: {
      from: ranges[0],
      to: ranges[1],
      panelId
    }
  });

  console.log("raw: ", rawData);

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

    const props = {
      ...options,
      dashboardId: dashboardId,
      panelId
    };

    await api.patch<ApiResponse<string>>(`/api/dashboard/panel`, props).finally(() => {
      refetch();
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

  const renderOperationButtons = () => {
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

  const getDocumentTitle = () => {
    return `${isCustomizeMode ? "Edit" : "View"} panel - ${options.title}`;
  };

  return (
    <Page
      title={getDocumentTitle()}
      header={
        !isCustomizeMode && {
          title: (
            <PreviewPageHeader
              page="panel preview"
              title={options.title}
              description={options.description}
              backOpts={backOpts}
            />
          ),
          suffix: renderOperationButtons()
        }
      }
    >
      <Page.Content className={!isCustomizeMode && "pt-0"}>
        <PanelContent
          data={data}
          rawData={rawData}
          isCustomizeMode={isCustomizeMode}
          isLoading={isLoadingRawData || isRefetchinRawData}
          isLoadingRaw={isLoadingRawData || isRefetchinRawData}
          isRawDataPreview={isRawDataPreview && !isCustomizeMode}
          options={options}
          setOptions={setOptions}
          renderPanel={() => renderPanel()}
          onCreate={onSave}
          onCancel={onDiscard}
        />
      </Page.Content>
    </Page>
  );
};

export default PanelPreviewPage;
