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
import { PreviewPageHeader } from "../../../core/components/PreviewPageHeader";
import { CheckOutlined } from "@ant-design/icons";
import { initialCustomPanelProps, validate } from "./utils";
import { PanelCustomizeForm } from "./components/PanelEditor/PanelCustomizeForm";

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

  return (
    <Page
      header={{
        title: <PreviewPageHeader title={options.title} description={options.description} />,
        suffix: (
          <Row className="ustify-end" gap="x-3">
            <Button
              icon={<CheckOutlined />}
              loading={saveLoading}
              variant="primary"
              size="sm"
              onClick={() => onCreate()}
            >
              Save
            </Button>
            <Button variant="danger" size="sm" onClick={() => onCancel()}>
              Cancel
            </Button>
          </Row>
        )
      }}
    >
      <Page.Content className="pt-0">
        <div className="w-full grid grid-cols-12">
          <div className="col-span-8 mr-1">
            <Card title="Visualization">
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
          </div>
          <div className="col-span-4">
            <PanelCustomizeForm setOptions={setOptions} options={options} />
          </div>
        </div>
      </Page.Content>
    </Page>
  );
};

export default CreatePanelPage;