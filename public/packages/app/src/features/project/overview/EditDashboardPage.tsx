import { ApiResponse, CreateProjectProps } from "@traceo/types";
import {
  Alert,
  Button,
  ButtonContainer,
  Card,
  Form,
  FormItem,
  Input,
  RadioButtonGroup,
  Switch,
  Typography
} from "@traceo/ui";
import { useState } from "react";
import { AppstoreFilled } from "@ant-design/icons";
import { Page } from "src/core/components/Page";
import api from "src/core/lib/api";
import { TRY_AGAIN_LATER_ERROR } from "src/core/utils/constants";
import { useNavigate } from "react-router-dom";
import { useProject } from "src/core/hooks/useProject";
import { useSelector } from "react-redux";
import { StoreState } from "@store/types";
import { Confirm } from "src/core/components/Confirm";

interface UpdateDashboardForm {
  name: string;
  isEditable: boolean;
}

const EditDashboardPage = () => {
  const { project } = useProject();
  const { dashboard } = useSelector((state: StoreState) => state.dashboard);

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(null);

  const [isEditable, setEditable] = useState<boolean>(dashboard.isEditable);

  const onFinish = async (form: UpdateDashboardForm) => {
    setLoading(true);
    const { name } = form;

    await api
      .patch<ApiResponse<{ id: string }>>("/api/dashboard", {
        ...dashboard,
        name,
        dashboardId: dashboard.id,
        projectId: project.id,
        isEditable
      })
      .then((response) => {
        if (response.status === "success") {
          navigate(`/project/${project.id}/dashboard/${dashboard.id}`);
        }
      })
      .catch(() => {
        setError(true);
        setErrorMessage(TRY_AGAIN_LATER_ERROR);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onRemove = async () => {
    await api
      .delete<ApiResponse<{ redirectUrl: string }>>(`/api/dashboard`, {
        dashboardId: dashboard.id,
        projectId: project.id
      })
      .then((response) => {
        if (response.status === "success") {
          navigate(response.data.redirectUrl);
        }
      })
      .catch(() => {
        setError(true);
        setErrorMessage(TRY_AGAIN_LATER_ERROR);
      });
  };

  return (
    <Page
      header={{
        icon: <AppstoreFilled />,
        title: "Dashboard settings",
        description: <p className="m-0 pt-1">Customize this dashboard to your needs.</p>
      }}
    >
      <Page.Content>
        <Card>
          <Typography size="xl" weight="semibold">
            1. Basic information
          </Typography>

          <Form
            onSubmit={onFinish}
            defaultValues={{
              name: dashboard.name,
              isEditable: dashboard.isEditable
            }}
            className="w-full"
            id="edit-dashboard-form"
          >
            {({ register, errors, setValue }) => (
              <div>
                <FormItem
                  className="pt-9 w-1/2"
                  showRequiredMark={true}
                  label="Name"
                  error={errors.name}
                >
                  <Input
                    {...register("name", {
                      required: true
                    })}
                  />
                </FormItem>
                <FormItem
                  className="pt-5 w-1/2"
                  tooltip="Allow to change layout"
                  label="Is editable"
                  error={errors.isEditable}
                >
                  <RadioButtonGroup
                    options={[
                      { label: "Yes", value: true },
                      { label: "No", value: false }
                    ]}
                    onChange={(e) => setEditable(e)}
                    value={isEditable}
                  />
                </FormItem>
              </div>
            )}
          </Form>
          {error && (
            <Alert className="font-semibold" type="error" showIcon title={errorMessage} />
          )}
          <ButtonContainer className="pt-5" justify="start">
            <Button type="submit" form="edit-dashboard-form" loading={loading}>
              Save
            </Button>
            <Button onClick={() => navigate(-1)} variant="ghost">
              Cancel
            </Button>
            <Confirm
              onOk={onRemove}
              description="Are you sure that you want to remove this dashboard?"
            >
              <Button variant="danger">Remove dashboard</Button>
            </Confirm>
          </ButtonContainer>
        </Card>
      </Page.Content>
    </Page>
  );
};

export default EditDashboardPage;
