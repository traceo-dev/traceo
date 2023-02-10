import { useSelector } from "react-redux";
import { Confirm } from "../../../../core/components/Confirm";
import { useAppDispatch } from "../../../../store";
import { UserStatus, ApiResponse } from "@traceo/types";
import { StoreState } from "@store/types";
import { updateUser } from "../../state/accounts/actions";
import api from "../../../../core/lib/api";
import { useNavigate } from "react-router-dom";
import { ADMIN_EMAIL } from "../../../../core/utils/constants";
import {
  Button,
  Typography,
  Card,
  Space,
  Alert,
  Form,
  FormItem,
  Input,
  ButtonContainer
} from "@traceo/ui";
import { ColumnSection } from "../../../../core/components/ColumnSection";

interface UserProps {
  email: string;
  name: string;
  username: string;
}

export const UserInformation = () => {
  const dispatch = useAppDispatch();
  const { account } = useSelector((state: StoreState) => state.serverAccounts);
  const navigate = useNavigate();

  const defaultValues: UserProps = {
    ...account
  };

  const isAdmin = account.email === ADMIN_EMAIL;

  const onFinish = (props: UserProps) => {
    dispatch(updateUser({ id: account.id, ...props }));
  };

  const onChangeUserStatus = () => {
    const status =
      account.status === UserStatus.DISABLED ? UserStatus.ACTIVE : UserStatus.DISABLED;
    dispatch(updateUser({ id: account.id, status }));
  };

  const onDeleteUser = async () => {
    await api
      .delete<ApiResponse<unknown>>(`/api/account/${account.id}`)
      .then((response) => {
        if (response.status === "success") {
          navigate("/dashboard/management/users");
        }
      });
  };

  const renderButtons = () => {
    const isDisableUserBtn = [UserStatus.ACTIVE, UserStatus.INACTIVE].includes(
      account.status
    );
    const isEnableUserBtn = UserStatus.DISABLED === account.status;
    return (
      <Space className="w-full justify-end">
        {isDisableUserBtn && (
          <Confirm
            onOk={onChangeUserStatus}
            description={
              <Typography>
                Are you sure that you want to suspend <b>{account.name}</b>? After this
                action, user will not be able to log into the account.
              </Typography>
            }
          >
            <Button variant="ghost">Disable user</Button>
          </Confirm>
        )}

        {isEnableUserBtn && (
          <Confirm
            onOk={() => onChangeUserStatus()}
            description={
              <Typography>
                Are you sure that you want to activate <b>{account.name}</b> account?
              </Typography>
            }
          >
            <Button variant="ghost">Enable user</Button>
          </Confirm>
        )}

        {!isAdmin && (
          <Confirm
            auth={true}
            description={"Are you sure that you want to delete this account?"}
            onOk={() => onDeleteUser()}
          >
            <Button variant="danger">Delete account</Button>
          </Confirm>
        )}
      </Space>
    );
  };

  return (
    <>
      {isAdmin && (
        <Alert
          type="warning"
          message="Administrator account is in read-only mode."
          className="my-1"
        />
      )}

      <Card title="Personal Information" extra={renderButtons()}>
        <ColumnSection subtitle="You can edit user details if needed. Remember to do it responsibly and only as a last resort.">
          <Form
            id="edit-user-form"
            className="w-2/3"
            defaultValues={defaultValues}
            onSubmit={onFinish}
          >
            {({ register, errors }) => (
              <>
                <FormItem disabled={isAdmin} label="Name" error={errors.name}>
                  <Input
                    {...register("name", {
                      required: false
                    })}
                  />
                </FormItem>
                <FormItem disabled={isAdmin} label="Username" error={errors.username}>
                  <Input
                    {...register("username", {
                      required: true
                    })}
                  />
                </FormItem>
                <FormItem disabled={isAdmin} label="Email" error={errors.email}>
                  <Input
                    {...register("email", {
                      required: false,
                      pattern: {
                        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Invalid email"
                      }
                    })}
                  />
                </FormItem>
              </>
            )}
          </Form>
          {!isAdmin && (
            <ButtonContainer className="pt-5" justify="start">
              <Button form="edit-user-form" type="submit">
                Save changes
              </Button>
            </ButtonContainer>
          )}
        </ColumnSection>
      </Card>
    </>
  );
};
