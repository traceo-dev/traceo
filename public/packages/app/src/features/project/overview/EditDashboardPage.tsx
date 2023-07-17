import { ApiResponse } from "@traceo/types";
import { Alert, Button, Card, Form, FormItem, Input, RadioButtonGroup } from "@traceo/ui";
import { Fragment, useState } from "react";
import { AppstoreFilled } from "@ant-design/icons";
import { Page } from "../../../core/components/Page";
import api from "../../../core/lib/api";
import { TRY_AGAIN_LATER_ERROR } from "../../../core/utils/constants";
import { useNavigate } from "react-router-dom";
import { Confirm } from "../../../core/components/Confirm";
import { ColumnSection } from "../../../core/components/ColumnSection";
import { useDashboard } from "../../../core/hooks/useDashboard";
import { BaseProjectViewType } from "../../../core/types/hoc";
import { Portal } from "../../../core/components/Portal";
import { EditDashboardToolbar } from "./components/Toolbars/EditDashboardToolbar";
import { useAppDispatch } from "../../../store";
import { loadDashboard } from "./state/actions";

interface UpdateDashboardForm {
  name: string;
  isEditable: boolean;
}

const EditDashboardPage = ({ project }: BaseProjectViewType) => {
  const dashboard = useDashboard();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(null);

  const [isEditable, setEditable] = useState<boolean>(dashboard.isEditable);
  const [isTimePicker, setTimePicker] = useState<boolean>(dashboard.isTimePicker);

  const onFinish = async (form: UpdateDashboardForm) => {
    const { name } = form;

    const props = {
      ...dashboard,
      name,
      dashboardId: dashboard.id,
      projectId: project.id,
      isEditable,
      isTimePicker
    };

    await api
      .patch<ApiResponse<unknown>>("/api/dashboard", props)
      .then((response) => {
        if (response.status === "success") {
          dispatch(loadDashboard(dashboard.id));
          navigate(`/project/${project.id}/dashboard/${dashboard.id}`);
        }
      })
      .catch(() => {
        setError(true);
        setErrorMessage(TRY_AGAIN_LATER_ERROR);
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
      <Portal id="dashboard-toolbar">
        <EditDashboardToolbar onCancel={() => navigate(-1)} />
      </Portal>
      <Page.Content>
        <Card title="Basic information">
          <Form
            onSubmit={onFinish}
            defaultValues={{
              name: dashboard.name,
              isEditable: dashboard.isEditable,
              isTimePicker: dashboard.isTimePicker
            }}
            className="w-full"
            id="edit-dashboard-form"
          >
            {({ register, errors }) => (
              <ColumnSection subtitle="Update basic information about this dashboard.">
                <Fragment>
                  <FormItem className="pt-2 w-1/2" label="Name" error={errors.name}>
                    <Input
                      {...register("name", {
                        required: true
                      })}
                    />
                  </FormItem>
                  {!dashboard.isBase && (
                    <Fragment>
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
                          onChange={(bool) => setEditable(bool)}
                          value={isEditable}
                        />
                      </FormItem>
                      <FormItem
                        className="pt-5 w-1/2"
                        label="Show time picker"
                        error={errors.isTimePicker}
                      >
                        <RadioButtonGroup
                          options={[
                            { label: "Yes", value: true },
                            { label: "No", value: false }
                          ]}
                          onChange={(bool) => setTimePicker(bool)}
                          value={isTimePicker}
                        />
                      </FormItem>
                    </Fragment>
                  )}
                </Fragment>
              </ColumnSection>
            )}
          </Form>
          {error && (
            <Alert className="font-semibold" type="error" showIcon title={errorMessage} />
          )}
        </Card>
        {!dashboard.isBase && (
          <Card title="Danger zone">
            <ColumnSection subtitle="Here you can remove this dashboard. Note that this operation is irreversible.">
              <Confirm
                onOk={onRemove}
                description="Are you sure that you want to remove this dashboard?"
              >
                <Button variant="danger">Remove dashboard</Button>
              </Confirm>
            </ColumnSection>
          </Card>
        )}
      </Page.Content>
    </Page>
  );
};

export default EditDashboardPage;
