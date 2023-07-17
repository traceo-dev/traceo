import { Page } from "../../../core/components/Page";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import {
  ApiResponse,
  DashboardPanel as DashboardPanelType,
  VISUALIZATION_TYPE
} from "@traceo/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import { useReactQuery } from "../../../core/hooks/useReactQuery";
import { isEmptyObject } from "../../../core/utils/object";
import { TraceoLoading } from "../../../core/components/TraceoLoading";
import api from "../../../core/lib/api";
import { notify } from "../../../core/utils/notify";
import { PanelToolbar } from "./components/Toolbars/PanelToolbar";
import { getVisualizationComponent, validate } from "./utils";
import { usePanelQuery } from "./components/Panels/usePanelQuery";
import { PanelProps } from "./components/Panels/types";
import { PanelContent } from "./PanelContent";
import withDashboard from "../../../core/hooks/withDashboard";
import { ProjectDashboardViewType } from "../../../core/types/hoc";
import { Portal } from "../../../core/components/Portal";

export const PanelPreviewPage = ({ dashboard, project }: ProjectDashboardViewType) => {
  const { panelId } = useParams();
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
    url: `/api/metrics/${project.id}/raw-data`,
    params: {
      from: ranges[0],
      to: ranges[1],
      panelId
    }
  });

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
      dashboardId: dashboard.id,
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

  const renderPanel = () => {
    const visualization = options.config.visualization;

    const props: PanelProps = {
      title: options.title,
      isEditable: false,
      isRemoveMode: false,
      isHoverOptions: false,
      panel: options,
      ranges: ranges,
      onChangeTimeRange: setRanges,
      dashboard
    };

    return getVisualizationComponent(visualization, props);
  };

  const getDocumentTitle = () => {
    return `${isCustomizeMode ? "Edit" : "View"} panel - ${options.title}`;
  };

  return (
    <Page title={getDocumentTitle()}>
      <Portal id="dashboard-toolbar">
        <PanelToolbar
          isCustomizeMode={isCustomizeMode}
          isTimePicker={isTimePicker}
          isCustomPanel={isCustomPanel}
          dashboard={dashboard}
          ranges={ranges}
          setRanges={setRanges}
          setCustomizeMode={setCustomizeMode}
          onSave={onSave}
          onDiscard={onDiscard}
        />
      </Portal>

      <Page.Content>
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
        />
      </Page.Content>
    </Page>
  );
};

export default withDashboard(PanelPreviewPage);
