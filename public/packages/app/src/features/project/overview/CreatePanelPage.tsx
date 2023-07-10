import { Page } from "../../../core/components/Page";
import { ApiResponse, DashboardPanel } from "@traceo/types";
import { useImmer } from "use-immer";
import { Button, Card, Row } from "@traceo/ui";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../core/components/DataNotFound";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../core/lib/api";
import { notify } from "../../../core/utils/notify";
import { CheckOutlined } from "@ant-design/icons";
import { initialCustomPanelProps, validate } from "./utils";
import { PanelContent } from "./PanelContent";

const CreatePanelPage = () => {
  const { id, dashboardId } = useParams();

  const navigate = useNavigate();

  const [options, setOptions] = useImmer<DashboardPanel>(initialCustomPanelProps);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const onCreate = async () => {
    const errors = validate(options);
    if (errors.length > 0) {
      notify.error(errors[0]);
      return;
    }

    setSaveLoading(true);
    await api
      .post<ApiResponse<DashboardPanel>>(`/api/dashboard/panel`, {
        ...options,
        dashboardId: dashboardId
      })
      .then((resp) => {
        if (resp.status === "success") {
          navigate({
            pathname: `/project/${id}/dashboard/${dashboardId}`
          });
        }
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const onCancel = () => {
    navigate({
      pathname: `/project/${id}/dashboard/${dashboardId}`
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

export default CreatePanelPage;
