import { Page } from "../../../core/components/Page";
import { ApiResponse, DashboardPanel } from "@traceo/types";
import { useImmer } from "use-immer";
import { Card } from "@traceo/ui";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../core/components/DataNotFound";
import { useNavigate } from "react-router-dom";
import api from "../../../core/lib/api";
import { notify } from "../../../core/utils/notify";
import { initialCustomPanelProps, validate } from "./utils";
import { PanelContent } from "./PanelContent";
import withDashboard from "src/core/hooks/withDashboard";
import { ProjectDashboardViewType } from "src/core/types/hoc";

const CreatePanelPage = ({ project, dashboard }: ProjectDashboardViewType) => {
  const navigate = useNavigate();
  const [options, setOptions] = useImmer<DashboardPanel>(initialCustomPanelProps);

  const onCreate = async () => {
    const errors = validate(options);
    if (errors.length > 0) {
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

  const renderPanel = () => (
    <Card>
      <ConditionalWrapper
        isEmpty
        emptyView={
          <DataNotFound
            label="Panel preview not available"
            explanation="Fill in the configuration data for this panel and save to see the preview."
          />
        }
      />
    </Card>
  );

  return (
    <Page title="Create panel">
      <Page.Content>
        <PanelContent
          isCustomizeMode={true}
          options={options}
          setOptions={setOptions}
          renderPanel={renderPanel}
          onCancel={onCancel}
          onCreate={onCreate}
        />
      </Page.Content>
    </Page>
  );
};

export default withDashboard(CreatePanelPage);
