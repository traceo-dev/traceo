import { Page } from "../../core/components/Page";
import api from "../../core/lib/api";
import { TRY_AGAIN_LATER_ERROR } from "../../core/utils/constants";
import { useAppDispatch } from "../../store/index";
import { hideNavbar } from "../../store/internal/navbar/actions";
import { loadApplication } from "../app/state/application/actions";
import { ApiResponse, CreateApplicationProps, SDK } from "@traceo/types";
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
import { useNavigate } from "react-router-dom";
import { resetApplicationState } from "../app/state/application/reducers";
import { ChooseElementGrid } from "../../core/components/ChooseElementGrid";

type CreateAppPayload = {
  redirectUrl: string;
  id: string;
  error?: string;
};

const technologyOptions: SelectOptionProps[] = [
  {
    label: "NodeJS",
    value: SDK.NODE,
    icon: <img src={`/img/svg/${SDK.NODE}.svg`} width="30" />
  },
  {
    label: "NestJS",
    value: SDK.NESTJS,
    icon: <img src={`/img/svg/${SDK.NESTJS}.svg`} width="40" />
  },
  {
    label: "React",
    value: SDK.REACT,
    icon: <img src={`/img/svg/${SDK.REACT}.svg`} width="40" />
  },
  {
    label: "Vue",
    value: SDK.VUE,
    icon: <img src={`/img/svg/${SDK.VUE}.svg`} width="40" />
  }
];

const CreateApplicationPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(null);

  const [selectedPlatform, setSelectedPlatform] = useState<SDK>(SDK.NODE);

  useEffect(() => {
    dispatch(resetApplicationState());
  }, []);

  const onFinish = async (form: CreateApplicationProps) => {
    setLoading(true);
    const { name } = form;
    const payload = {
      name,
      sdk: selectedPlatform
    };
    await api
      .post<ApiResponse<CreateAppPayload>>("/api/application", payload)
      .then(({ data, status }) => {
        if (status === "success") {
          dispatch(loadApplication({ id: data.id }));
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

  const onBack = () => {
    dispatch(hideNavbar(false));
    navigate("/dashboard/applications");
  };

  return (
    <Page
      header={{
        title: "Create new application",
        description: (
          <div>
            <p className="m-0 pt-3">
              Create a new application and then connect it to your software to track its
              performance and capture any unwanted behavior.
            </p>
            <p className="m-0">
              Information on how to connect the SDK to your software can be found here.
            </p>
          </div>
        )
      }}
    >
      <Page.Content>
        <Card>
          <Typography className="text-white" size="xl" weight="semibold">
            1. Choose yout platform
          </Typography>
          <ChooseElementGrid
            options={technologyOptions}
            onSelect={(v) => setSelectedPlatform(v)}
            selected={selectedPlatform}
          />
          <Form onSubmit={onFinish} className="w-full" id="create-app-form">
            {({ register, errors }) => (
              <div>
                <Typography className="text-white" size="xl" weight="semibold">
                  2. Name your app
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
            <Button type="submit" form="create-app-form" loading={loading}>
              Save
            </Button>
            <Button variant="ghost" onClick={() => onBack()}>
              Cancel
            </Button>
          </ButtonContainer>
        </Card>
      </Page.Content>
    </Page>
  );
};

export default CreateApplicationPage;
