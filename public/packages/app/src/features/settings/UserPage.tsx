import { ColumnSection } from "../../core/components/ColumnSection";
import { useAppDispatch } from "../../store";
import { UserSettingsPageWrapper } from "./components/UserSettingsPageWrapper";
import {
  updateUser,
  updateUserPassword
} from "../app/settings/state/settings/actions";
import {
  Input,
  InputSecret,
  Button,
  ButtonContainer,
  Form,
  FormItem,
  Card
} from "@traceo/ui";
import { useMemberRole } from "../../core/hooks/useMemberRole";
import { useDemo } from "../../core/hooks/useDemo";
import { userUser } from "../../core/hooks/useUser";

type UpdateUserForm = {
  name: string;
  email: string;
};

type UpdatePasswordForm = {
  password: string;
  newPassword: string;
};

const UserProfilePage = () => {
  const dispatch = useAppDispatch();
  const user = userUser();
  const { isAdmin } = useMemberRole();
  const { isDemo } = useDemo();

  const onFinishUpdateUser = (form: UpdateUserForm) =>
    dispatch(
      updateUser({
        id: user.id,
        ...form
      })
    );

  const onFinishUpdatePassword = (form: UpdatePasswordForm) =>
    dispatch(updateUserPassword(form));

  return (
    <UserSettingsPageWrapper>
      <Card title="Basic Information">
        <ColumnSection
          title="Personal information"
          subtitle="This information will appear on your profile."
        >
          <Form
            onSubmit={onFinishUpdateUser}
            defaultValues={{
              name: user?.name,
              email: user?.email
            }}
            id="basic-info-form"
            className="w-2/3"
          >
            {({ register, errors }) => (
              <>
                <FormItem label="Name" error={errors?.name} disabled={isAdmin || isDemo}>
                  <Input
                    {...register("name", {
                      required: true
                    })}
                  />
                </FormItem>

                <FormItem
                  label="Email"
                  error={errors?.email}
                  disabled={isAdmin || isDemo}
                >
                  <Input
                    {...register("email", {
                      required: false,
                      pattern: {
                        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "This email address is invalid"
                      }
                    })}
                  />
                </FormItem>
              </>
            )}
          </Form>
          {!isAdmin && (
            <ButtonContainer justify="start">
              <Button form="basic-info-form" type="submit">
                Update
              </Button>
            </ButtonContainer>
          )}
        </ColumnSection>
      </Card>

      <Card title="Security">
        <ColumnSection
          title="Update password"
          subtitle="After a successful password update, you will be redirected to the login page where you can log in with your new password."
        >
          <Form
            onSubmit={onFinishUpdatePassword}
            id="update-password-form"
            className="w-2/3"
          >
            {({ register, errors }) => (
              <>
                <FormItem label="Password" error={errors.password}>
                  <InputSecret
                    {...register("password", {
                      required: true
                    })}
                  />
                </FormItem>

                <FormItem label="New password" error={errors.newPassword}>
                  <InputSecret
                    {...register("newPassword", {
                      required: true,
                      pattern: {
                        value: /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
                        message: "This password is too weak"
                      }
                    })}
                  />
                </FormItem>
              </>
            )}
          </Form>
          <ButtonContainer justify="start">
            <Button type="submit" form="update-password-form">
              Confirm
            </Button>
          </ButtonContainer>
        </ColumnSection>
      </Card>
    </UserSettingsPageWrapper>
  );
};

export default UserProfilePage;
