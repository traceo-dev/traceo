import { AppstoreOutlined, ArrowLeftOutlined, LeftOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../store/index";
import { AddUserProps, ApiResponse } from "@traceo/types";
import {
  Alert,
  Button,
  ButtonContainer,
  Card,
  Form,
  FormItem,
  Input,
  InputSecret,
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

type CreateUserPayload = {
  id: string;
  error?: string;
};
const CreateUserPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(null);

  useEffect(() => {
    dispatch(navbarState({ hidden: true }));
  }, []);

  const onFinish = async (form: AddUserProps) => {
    setLoading(true);
    await api
      .post<ApiResponse<CreateUserPayload>>("/api/user/new", form)
      .then(({ data, status }) => {
        if (status === "success") {
          dispatch(navbarState({ hidden: false }));
          navigate(`/dashboard/management/users/${data.id}`);
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
          <div className="col-span-1 pr-2">
            <div className="flex flex-col">
              <div
                onClick={() => onBack()}
                className="text-xs cursor-pointer flex flex-ro gap-x-2 items-center font-semibold pb-3 hover:text-yellow-500"
              >
                <ArrowLeftOutlined />
                <span>Back</span>
              </div>
              <span className="font-semibold text-lg">New user</span>
              <span className="text-xs pt-1">
                Create new user in this Traceo instance. After this you'll be able to
                attach him to any apps.
              </span>
              <Alert
                type="success"
                className="mt-9"
                message="After creating a new user, you will be able to assign him to a specific application."
              />
            </div>
          </div>
          <div className="col-span-4 overflow-y-scroll">
            <Card>
              <Form onSubmit={onFinish} id="add-user-form">
                {({ register, errors }) => (
                  <>
                    <Typography size="xl" weight="semibold">
                      Basic informations
                    </Typography>
                    <FormItem
                      showRequiredMark={true}
                      className="pt-9"
                      label="Username"
                      error={errors.username}
                    >
                      <Input
                        {...register("username", {
                          required: true
                        })}
                      />
                    </FormItem>
                    <FormItem label="Name" error={errors.name}>
                      <Input
                        {...register("name", {
                          required: false
                        })}
                      />
                    </FormItem>
                    <FormItem label="Email" error={errors.email}>
                      <Input
                        {...register("email", {
                          required: false,
                          pattern: {
                            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: "Invalid email address"
                          }
                        })}
                      />
                    </FormItem>
                    <FormItem
                      showRequiredMark={true}
                      label="Password"
                      error={errors.password}
                    >
                      <InputSecret
                        {...register("password", {
                          required: true,
                          pattern: {
                            value:
                              /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
                            message: "This password is too weak"
                          }
                        })}
                      />
                    </FormItem>
                  </>
                )}
              </Form>
              {error && (
                <Alert
                  className="font-semibold"
                  type="error"
                  showIcon
                  title={errorMessage}
                />
              )}
              <ButtonContainer className="pt-5" justify="start">
                <Button type="submit" form="add-user-form" loading={loading}>
                  Confirm
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

export default CreateUserPage;
