import { Page } from "../../../core/components/Page";
import { ApiResponse, DashboardPanel, isEmpty } from "@traceo/types";
import { useImmer } from "use-immer";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../core/components/DataNotFound";
import { useNavigate } from "react-router-dom";
import api from "../../../core/lib/api";
import { notify } from "../../../core/utils/notify";
import { getVisualizationComponent, initialCustomPanelProps, validate } from "./utils";
import { PanelContent } from "./PanelContent";
import withDashboard from "../../../core/hooks/withDashboard";
import { ProjectDashboardViewType } from "../../../core/types/hoc";
import { Portal } from "../../../core/components/Portal";
import { CreatePanelToolbar } from "./components/Toolbars/CreatePanelToolbar";
import { ContentCard } from "../../../core/components/ContentCard";
import { PanelProps } from "./components/Panels/types";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import dayjs from "dayjs";

const CreatePanelPage = ({ project, dashboard }: ProjectDashboardViewType) => {
  const navigate = useNavigate();
  const [options, setOptions] = useImmer<DashboardPanel>(initialCustomPanelProps);

  const { ranges, setRanges } = useTimeRange({
    from: dayjs().subtract(1, "h").unix(),
    to: dayjs().unix()
  });

  const onCreate = async () => {
    const errors = validate(options);
    if (!isEmpty(errors)) {
      notify.error(errors[0]);
      return;
    }

    await api
      .post<ApiResponse<DashboardPanel>>(`/api/dashboard/panel`, {
        ...options,
        dashboardId: dashboard.id
      })
      .then((resp) => {
        if (resp.status === "success") {
          navigate({
            pathname: `/project/${project.id}/dashboard/${dashboard.id}`
          });
        }
      });
  };

  const onCancel = () => {
    navigate({
      pathname: `/project/${project.id}/dashboard/${dashboard.id}`
    });
  };

  const renderPanel = () => {
    const visualization = options.config.visualization;
    const dsFields = options.config.series
      .map(({ datasource }) => datasource.field)
      .filter((e) => e);

    const hasSeries = !isEmpty(dsFields);

    if (hasSeries) {
      const props: PanelProps = {
        title: options.title,
        isEditable: false,
        height: 300,
        panel: options,
        ranges: ranges,
        onChangeTimeRange: setRanges,
        dashboard,
        project
      };

      return getVisualizationComponent(visualization, props);
    }

    return <PreviewNotAvailable />;
  };

  return (
    <Page title="Create panel">
      <Portal id="dashboard-toolbar">
        <CreatePanelToolbar onCancel={onCancel} onSave={onCreate} />
      </Portal>
      <Page.Content>
        <PanelContent
          isCustomizeMode={true}
          options={options}
          setOptions={setOptions}
          renderPanel={renderPanel}
        />
      </Page.Content>
    </Page>
  );
};

const PreviewNotAvailable = () => (
  <ContentCard name="Visualization">
    <ConditionalWrapper
      isEmpty
      emptyView={
        <DataNotFound
          label="Panel preview not available"
          explanation="Fill in the datasource for this panel to see a preview of the chart."
        />
      }
    />
  </ContentCard>
);

export default withDashboard(CreatePanelPage);
