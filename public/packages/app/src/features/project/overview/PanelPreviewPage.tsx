import { Page } from "../../../core/components/Page";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import {
  ApiResponse,
  DashboardPanel as DashboardPanelType,
  VISUALIZATION_TYPE,
  isEmpty
} from "@traceo/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import { useReactQuery } from "../../../core/hooks/useReactQuery";
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
import { isEmptyObject } from "../../../core/utils/object";

export const PanelPreviewPage = ({ dashboard, project }: ProjectDashboardViewType) => {
  const { panelId } = useParams();
  const { ranges, setRanges } = useTimeRange();
  const { panel, refetch } = usePanelQuery();

  const [panelOptions, setPanelOptions] = useImmer<DashboardPanelType>(panel);
  const [isCustomizeMode, setCustomizeMode] = useState<boolean>(false);

  const isCustomPanel = panelOptions?.type === "custom";
  const visualization = panelOptions?.config.visualization;

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
    url: `/api/metrics/${project.id}/raw-data/datasource`,
    params: {
      from: ranges[0],
      to: ranges[1],
      panelId
    }
  });

  useEffect(() => {
    setPanelOptions(panel);
  }, [panel]);

  useEffect(() => {
    refetch();
    refetchRawData();
  }, [ranges]);

  if (!panelOptions || isEmptyObject(panelOptions)) {
    return <TraceoLoading />;
  }

  const onSave = async () => {
    const errors = validate(panelOptions);
    if (!isEmpty(errors)) {
      notify.error(errors[0]);
      return;
    }

    const props = {
      ...panelOptions,
      dashboardId: dashboard.id,
      panelId
    };

    await api.patch<ApiResponse<string>>(`/api/dashboard/panel`, props).finally(() => {
      refetch();
      setCustomizeMode && setCustomizeMode(false);
    });
  };

  const onDiscard = () => {
    setPanelOptions(panel);
    setCustomizeMode(false);
  };

  const renderPanel = () => {
    const visualization = panelOptions.config.visualization;

    const props: PanelProps = {
      title: panelOptions.title,
      isEditable: false,
      isRemoveMode: false,
      isHoverOptions: false,
      height: isCustomizeMode ? 300 : 600,
      panel: panelOptions,
      ranges: ranges,
      onChangeTimeRange: setRanges,
      dashboard,
      project,
      lazy: false
    };

    return getVisualizationComponent(visualization, props);
  };

  const getDocumentTitle = () => {
    return `${isCustomizeMode ? "Edit" : "View"} panel - ${panelOptions?.title}`;
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
          rawData={rawData}
          isCustomizeMode={isCustomizeMode}
          isLoading={isLoadingRawData || isRefetchinRawData}
          isLoadingRaw={isLoadingRawData || isRefetchinRawData}
          isRawDataPreview={isRawDataPreview}
          options={panelOptions}
          setOptions={setPanelOptions}
          renderPanel={() => renderPanel()}
        />
      </Page.Content>
    </Page>
  );
};

export default withDashboard(PanelPreviewPage);
