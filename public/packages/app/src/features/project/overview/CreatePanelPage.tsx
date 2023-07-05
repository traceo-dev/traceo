import { Page } from "../../../core/components/Page";
import { ApiResponse, DashboardPanel } from "@traceo/types";
import { DeepPartial } from "redux";
import { useImmer } from "use-immer";
import { Button, Card, Row } from "@traceo/ui";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../core/components/DataNotFound";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../core/lib/api";
import { notify } from "../../../core/utils/notify";
import { PreviewPageHeader } from "../../../core/components/PreviewPageHeader";
import { CheckOutlined } from "@ant-design/icons";
import { PanelCustomizeForm } from "./components/PanelCustomizeForm";
import { initialCustomPanelProps } from "./utils";

const CreatePanelPage = () => {
  const { id, did } = useParams();

  const navigate = useNavigate();

  const [options, setOptions] = useImmer<DeepPartial<DashboardPanel>>(initialCustomPanelProps);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const onCreate = async () => {
    const isCustom = options.type === "custom";
    if (!options.title) {
      notify.error("Panel name is required.");
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
    if (missingField && isCustom) {
      notify.error("Your metric serie does not have a required field value.");
      return;
    }

    setSaveLoading(true);

    await api
      .post<ApiResponse<DashboardPanel>>(`/api/dashboard/panel`, {
        ...options,
        dashboardId: did
      })
      .then((resp) => {
        if (resp.status === "success") {
          navigate({
            pathname: `/project/${id}/dashboard/${did}`
          });
        }
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const onCancel = () => {
    navigate(`/project/${id}/dashboard/${did}`);
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
            <PanelCustomizeForm data={[[]]} setOptions={setOptions} options={options} />
          </div>
        </div>
      </Page.Content>
    </Page>
  );
};

export default CreatePanelPage;
