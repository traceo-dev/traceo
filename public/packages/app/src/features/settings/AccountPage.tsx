import { ColumnSection } from "../../core/components/ColumnSection";
import { useAppDispatch } from "../../store";
import { AccountSettingsPageWrapper } from "./components/AccountSettingsPageWrapper";
import {
  updateAccount,
  updateAccountPassword
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
import { useAccount } from "../../core/hooks/useAccount";

type UpdateAccountForm = {
  name: string;
  email: string;
};

type UpdatePasswordForm = {
  password: string;
  newPassword: string;
};

const AccountPage = () => {
  const dispatch = useAppDispatch();
  const account = useAccount();
  const { isAdmin } = useMemberRole();
  const { isDemo } = useDemo();

  const onFinishUpdateAccount = (form: UpdateAccountForm) =>
    dispatch(
      updateAccount({
        id: account.id,
        ...form
      })
    );

  const onFinishUpdatePassword = (form: UpdatePasswordForm) =>
    dispatch(updateAccountPassword(form));

  return (
    <AccountSettingsPageWrapper>
      <Card title="Basic Information">
        <ColumnSection
          title="Personal information"
          subtitle="This information will appear on your profile."
        >
          <Form
            onSubmit={onFinishUpdateAccount}
            defaultValues={{
              name: account?.name,
              email: account?.email
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
    </AccountSettingsPageWrapper>
  );
};

export default AccountPage;
