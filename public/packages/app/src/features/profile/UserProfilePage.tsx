import { Fragment } from "react";
import { ColumnSection } from "../../core/components/ColumnSection";
import { ConditionalWrapper } from "../../core/components/ConditionLayout";
import { useUser } from "../../core/hooks/useUser";
import { useAppDispatch } from "../../store";
import { UserSettingsPageWrapper } from "./components/UserSettingsPageWrapper";
import { updateUser, updateUserPassword } from "./state/actions";
import { Input, InputSecret, Button, ButtonContainer, Form, FormItem, Card } from "@traceo/ui";

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
  const user = useUser();

  const onFinishUpdateUser = (form: UpdateUserForm) =>
    dispatch(
      updateUser({
        id: user.id,
        ...form
      })
    );

  const onFinishUpdatePassword = (form: UpdatePasswordForm) => dispatch(updateUserPassword(form));

  return (
    <UserSettingsPageWrapper>
      <Card title="Basic Information">
        <ConditionalWrapper isLoading={!user}>
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
                <Fragment>
                  <FormItem label="Name" error={errors?.name} disabled={user.isAdmin}>
                    <Input
                      {...register("name", {
                        required: true
                      })}
                    />
                  </FormItem>

                  <FormItem label="Email" error={errors?.email} disabled={user.isAdmin}>
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
                </Fragment>
              )}
            </Form>
            {!user.isAdmin && (
              <ButtonContainer justify="start">
                <Button form="basic-info-form" type="submit">
                  Update
                </Button>
              </ButtonContainer>
            )}
          </ColumnSection>
        </ConditionalWrapper>
      </Card>

      <Card title="Security">
        <ColumnSection
          title="Update password"
          subtitle="After a successful password update, you will be redirected to the login page where you can log in with your new password."
        >
          <Form onSubmit={onFinishUpdatePassword} id="update-password-form" className="w-2/3">
            {({ register, errors }) => (
              <Fragment>
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
              </Fragment>
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
