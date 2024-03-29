import { Page } from "../../core/components/Page";
import api from "../../core/lib/api";
import { TRY_AGAIN_LATER_ERROR } from "../../core/utils/constants";
import { useAppDispatch } from "../../store/index";
import { loadProject } from "../project/state/project/actions";
import { ApiResponse, CreateProjectProps, SDK } from "@traceo/types";
import {
  Alert,
  Button,
  ButtonContainer,
  Card,
  Form,
  FormItem,
  Input,
  SelectOptionProps,
  Typography
} from "@traceo/ui";
import { useEffect, useState } from "react";
import { ChooseElementGrid } from "../../core/components/ChooseElementGrid";
import { resetProjectState } from "../project/state/project/reducers";
import { AppstoreAddOutlined, BarChartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { SdkIcon } from "../../core/components/SdkIcon";

type CreateAppPayload = {
  redirectUrl: string;
  id: string;
  error?: string;
};

const technologyOptions: SelectOptionProps[] = [
  {
    label: "Java",
    value: SDK.JAVA,
    icon: <SdkIcon sdk={SDK.JAVA} width={40} />
  },
  {
    label: "NodeJS",
    value: SDK.NODE,
    icon: <SdkIcon sdk={SDK.NODE} width={40} />
  },
  {
    label: "React",
    value: SDK.REACT,
    icon: <SdkIcon sdk={SDK.REACT} width={40} />
  },
  {
    label: "Vue",
    value: SDK.VUE,
    icon: <SdkIcon sdk={SDK.VUE} width={40} />
  }
];

const CreateProjectPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(null);

  const [selectedPlatform, setSelectedPlatform] = useState<SDK>(SDK.JAVA);

  useEffect(() => {
    dispatch(resetProjectState());
  }, []);

  const onFinish = async (form: CreateProjectProps) => {
    setLoading(true);
    const { name } = form;
    const payload = {
      name,
      sdk: selectedPlatform
    };
    await api
      .post<ApiResponse<CreateAppPayload>>("/api/project", payload)
      .then(({ data, status }) => {
        if (status === "success") {
          dispatch(loadProject({ id: data.id }));
          window.location.href = data.redirectUrl;
        } else {
          setError(true);
          setErrorMessage(data?.error || TRY_AGAIN_LATER_ERROR);
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
      title="Create project"
      header={{
        icon: <AppstoreAddOutlined />,
        title: "Create new project",
        description: (
          <div>
            <p className="m-0 pt-3">Create new project inside your Traceo instance.</p>
            <p className="m-0">
              Information on how to connect the SDK to your software can be found here.
            </p>
          </div>
        )
      }}
    >
      <Page.Content>
        <Card>
          <Typography size="xl" weight="semibold">
            1. Choose your platform
          </Typography>
          <ChooseElementGrid
            options={technologyOptions}
            onSelect={(v) => setSelectedPlatform(v)}
            selected={selectedPlatform}
          />
          <Form onSubmit={onFinish} className="w-full" id="create-project-form">
            {({ register, errors }) => (
              <div>
                <Typography size="xl" weight="semibold">
                  2. Name your project
                </Typography>
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
            <Button type="submit" form="create-project-form" loading={loading}>
              Confirm
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

export default CreateProjectPage;
