import { Page } from "../../core/components/Page";
import api from "../../core/lib/api";
import { TRY_AGAIN_LATER_ERROR } from "../../core/utils/constants";
import { useAppDispatch } from "../../store/index";
import { hideNavbar } from "../../store/internal/navbar/actions";
import { AddUserProps, ApiResponse } from "@traceo/types";
import {
  Alert,
  Button,
  ButtonContainer,
  Card,
  Form,
  FormItem,
  Input,
  InputSecret
} from "@traceo/ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAddOutlined } from "@ant-design/icons";
import { RouterLink } from "../../core/components/RouterLink";
import { resetProjectState } from "../project/state/project/reducers";

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
    dispatch(resetProjectState());
  }, []);

  const onFinish = async (form: AddUserProps) => {
    setLoading(true);
    await api
      .post<ApiResponse<CreateUserPayload>>("/api/user/new", form)
      .then(({ data, status }) => {
        if (status === "success") {
          dispatch(hideNavbar(false));
          navigate(`/dashboard/admin/users/${data.id}`);
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

  return (
    <Page
      header={{
        icon: <UserAddOutlined />,
        title: "Create new user",
        description: (
          <div>
            <p className="m-0 pt-3">Create new user in your Traceo instance.</p>
            <p className="m-0">
              Remember the entered data, because they will be useful for this user to log in.
            </p>
          </div>
        )
      }}
    >
      <Page.Content>
        <Card>
          <Form onSubmit={onFinish} id="add-user-form">
            {({ register, errors }) => (
              <>
                <FormItem
                  showRequiredMark={true}
                  className="pt-5"
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
                <FormItem showRequiredMark={true} label="Password" error={errors.password}>
                  <InputSecret
                    {...register("password", {
                      required: true,
                      pattern: {
                        value: /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
                        message: "This password is too weak"
                      }
                    })}
                  />
                </FormItem>

                {error && (
                  <Alert className="font-semibold" type="error" showIcon title={errorMessage} />
                )}
              </>
            )}
          </Form>

          <ButtonContainer className="pt-5" justify="start">
            <Button type="submit" form="add-user-form" loading={loading}>
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

export default CreateUserPage;
