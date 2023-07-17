import { ApiResponse, CreateProjectProps } from "@traceo/types";
import {
  Alert,
  Button,
  ButtonContainer,
  Card,
  Form,
  FormItem,
  Input,
  Typography
} from "@traceo/ui";
import { useState } from "react";
import { AppstoreFilled } from "@ant-design/icons";
import { Page } from "../../../core/components/Page";
import api from "../../../core/lib/api";
import { TRY_AGAIN_LATER_ERROR } from "../../../core/utils/constants";
import { useNavigate } from "react-router-dom";
import { BaseProjectViewType } from "../../../core/types/hoc";

const CreateDashboardPage = ({ project }: BaseProjectViewType) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(null);

  const onFinish = async (form: CreateProjectProps) => {
    setLoading(true);
    const { name } = form;

    await api
      .post<ApiResponse<{ id: string }>>("/api/dashboard", {
        name,
        projectId: project.id
      })
      .then((response) => {
        if (response.status === "success") {
          navigate({
            pathname: `/project/${project.id}/dashboard/${response.data.id}`
          });
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

  return (
    <Page
      header={{
        icon: <AppstoreFilled />,
        title: "Create new dashboard",
        description: (
          <p className="m-0 pt-1">
            This dashboard will be created for the <b>{project.name}</b> project.
          </p>
        )
      }}
    >
      <Page.Content>
        <Card>
          <Typography size="xl" weight="semibold">
            1. Basic information
          </Typography>

          <Form onSubmit={onFinish} className="w-full" id="create-dashboard-form">
            {({ register, errors }) => (
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
              </div>
            )}
          </Form>
          {error && (
            <Alert className="font-semibold" type="error" showIcon title={errorMessage} />
          )}
          <ButtonContainer className="pt-5" justify="start">
            <Button type="submit" form="create-dashboard-form" loading={loading}>
              Save
            </Button>
            <Button onClick={() => navigate(-1)} variant="ghost">
              Cancel
            </Button>
          </ButtonContainer>
        </Card>
      </Page.Content>
    </Page>
  );
};

export default CreateDashboardPage;
