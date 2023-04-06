import { ColumnSection } from "../../../../core/components/ColumnSection";
import { Confirm } from "../../../../core/components/Confirm";
import api from "../../../../core/lib/api";
import { ADMIN_EMAIL } from "../../../../core/utils/constants";
import { useAppDispatch } from "../../../../store";
import { StoreState } from "@store/types";
import { UserStatus, ApiResponse } from "@traceo/types";
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
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../state/users/actions";

interface UserProps {
  email: string;
  name: string;
  username: string;
}

export const UserInformation = () => {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: StoreState) => state.adminUser);
  const navigate = useNavigate();

  const defaultValues: UserProps = {
    ...user
  };

  const isAdmin = user.email === ADMIN_EMAIL;

  const onFinish = (props: UserProps) => {
    dispatch(updateUser({ id: user.id, ...props }));
  };

  const onChangeUserStatus = () => {
    const status = user.status === UserStatus.DISABLED ? UserStatus.ACTIVE : UserStatus.DISABLED;
    dispatch(updateUser({ id: user.id, status }));
  };

  const onDeleteUser = async () => {
    await api.delete<ApiResponse<unknown>>(`/api/user/${user.id}`).then((response) => {
      if (response.status === "success") {
        navigate("/dashboard/admin/users");
      }
    });
  };

  const isActive = [UserStatus.ACTIVE, UserStatus.INACTIVE].includes(user.status);
  const isDisabled = UserStatus.DISABLED === user.status;

  const renderButtons = () => {
    return (
      <Space className="w-full justify-end">
        {isActive && (
          <Confirm
            onOk={onChangeUserStatus}
            description={
              <Typography>
                Are you sure that you want to suspend <b>{user.name}</b>? After this action, user
                will not be able to log into the user.
              </Typography>
            }
          >
            <Button variant="ghost">Disable user</Button>
          </Confirm>
        )}

        {isDisabled && (
          <Confirm
            onOk={() => onChangeUserStatus()}
            description={
              <Typography>
                Are you sure that you want to activate <b>{user.name}</b> user?
              </Typography>
            }
          >
            <Button variant="ghost">Enable user</Button>
          </Confirm>
        )}

        {!isAdmin && (
          <Confirm
            auth={true}
            description={"Are you sure that you want to delete this user?"}
            onOk={() => onDeleteUser()}
          >
            <Button variant="danger">Delete user</Button>
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
          message="Sudo administrator account is always in read-only mode."
          className="my-1"
        />
      )}

      {isDisabled && <Alert type="info" message="This user is disabled." className="my-1" />}

      <Card title="Basic informations" extra={renderButtons()}>
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
