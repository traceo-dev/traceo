import { AppstoreOutlined, ArrowLeftOutlined, LeftOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../store/index";
import { ApiResponse, CreateApplicationProps, TsdbProvider } from "@traceo/types";
import {
  Alert,
  Button,
  ButtonContainer,
  Card,
  Form,
  FormItem,
  Input,
  Select,
  SelectOptionProps,
  Typography
} from "@traceo/ui";
import { useEffect, useState } from "react";
import { Page } from "src/core/components/Page";
import { loadApplication } from "../app/state/application/actions";
import { useNavigate } from "react-router-dom";
import { navbarState } from "../app/state/navbar/reducers";
import api from "src/core/lib/api";
import { TRY_AGAIN_LATER_ERROR } from "src/core/utils/constants";
import { InfluxForm } from "src/core/components/Forms/InfluxForm";

type CreateAppPayload = {
  redirectUrl: string;
  id: string;
  error?: string;
};

const technologyOptions: SelectOptionProps[] = [
  {
    label: "NodeJS",
    value: "nodejs",
    description:
      "Back-end JavaScript runtime environment, runs on the V8 JavaScript Engine."
  }
];

const dataSourceOptions = [
  {
    label: "InfluxDB",
    description: "High-speed read and write database. Supported in version +1.8.",
    value: TsdbProvider.INFLUX2
  }
];

const CreateApplicationPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDS, setSelectedDS] = useState<TsdbProvider>(null);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(null);

  useEffect(() => {
    dispatch(navbarState({ hidden: true }));
  }, []);

  const onFinish = async (form: CreateApplicationProps) => {
    setLoading(true);

    const payload = {
      name: form.name,
      technology: form.technology,
      tsdbProvider: form.tsdbProvider
    };

    if (form.tsdbProvider === TsdbProvider.INFLUX2) {
      payload["tsdbConfiguration"] = form?.tsdbConfiguration?.influx;
    }

    await api
      .post<ApiResponse<CreateAppPayload>>("/api/application", payload)
      .then(({ data, status }) => {
        if (status === "success") {
          dispatch(loadApplication({ id: data.id }));
          navigate(data.redirectUrl);
        } else {
          setError(true);
          setErrorMessage(data?.error);
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
    dispatch(navbarState({ hidden: false }));
    navigate("/dashboard/overview");
  };

  return (
    <Page>
      <Page.Content>
        <div className="w-full grid grid-cols-5">
          <div className="col-span-1 mr-3">
            <div className="flex flex-col">
              <div
                onClick={() => onBack()}
                className="text-xs cursor-pointer flex flex-ro gap-x-2 items-center font-semibold pb-3 hover:text-yellow-500"
              >
                <ArrowLeftOutlined />
                <span>Back</span>
              </div>
              <span className="font-semibold text-lg">New application</span>
              <span className="text-xs pt-1">
                Create new application by providing basic information.
              </span>
              <Alert
                type="success"
                className="mt-9"
                message="Select and configure time series provider to enable metrics collection. Remember that you can do this in any time."
              />
            </div>
          </div>
          <div className="col-span-4 overflow-y-scroll">
            <Card>
              <Form onSubmit={onFinish} id="create-app-form">
                {({ register, errors, setValue, watch }) => (
                  <>
                    <Typography size="xl" weight="semibold">
                      Basic informations
                    </Typography>
                    <FormItem
                      className="pt-9"
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
                      showRequiredMark={true}
                      label="Technology"
                      error={errors.technology}
                      className="pb-12"
                    >
                      <Select
                        {...register("technology", {
                          required: true
                        })}
                        options={technologyOptions}
                        onChange={(opt) => setValue("technology", opt?.value)}
                      />
                    </FormItem>

                    <Typography size="xl" weight="semibold">
                      Connect time series database
                    </Typography>
                    <FormItem
                      label="Time series provider"
                      error={errors.tsdbProvider}
                      className="pt-9"
                    >
                      <Select
                        isClearable
                        placeholder="Select data source provider"
                        {...register("tsdbProvider", { required: false })}
                        options={dataSourceOptions}
                        onChange={(opt) => setValue("tsdbProvider", opt?.value)}
                      />
                    </FormItem>

                    {watch("tsdbProvider") === TsdbProvider.INFLUX2 && (
                      <InfluxForm
                        errors={errors.tsdbConfiguration?.influx}
                        register={register}
                        namePrefix="tsdbConfiguration.influx."
                      />
                    )}

                    {error && (
                      <Alert
                        className="font-semibold"
                        type="error"
                        showIcon
                        title={errorMessage}
                      />
                    )}
                  </>
                )}
              </Form>
              <ButtonContainer className="pt-5" justify="start">
                <Button type="submit" form="create-app-form" loading={loading}>
                  Save
                </Button>
                <Button variant="ghost" onClick={() => onBack()}>
                  Cancel
                </Button>
              </ButtonContainer>
            </Card>
          </div>
        </div>
      </Page.Content>
    </Page>
  );
};

export default CreateApplicationPage;
