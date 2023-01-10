import { useState } from "react";
import { useSelector } from "react-redux";
import { ColumnSection } from "../../core/components/ColumnSection";
import { StoreState } from "../../types/store";
import { dispatch } from "../../store/store";
import { DashboardSettingsNavigation } from "../../features/settings/components/DashboardSettingsNavigation";
import {
  updateAccount,
  updateAccountPassword
} from "../../features/app/settings/state/settings/actions";
import { ADMIN_EMAIL } from "../../core/utils/constants";
import { PagePanel } from "../../core/components/PagePanel";
import { Input } from "core/ui-components/Input/Input";
import { InputSecret } from "core/ui-components/Input/InputSecret";
import { Button } from "core/ui-components/Button/Button";
import { Form } from "core/ui-components/Form/Form";
import { FormItem } from "core/ui-components/Form/FormItem";
import { ButtonContainer } from "core/ui-components/Button/ButtonContainer";

const SettingsAccountPage = () => {
  const { account } = useSelector((state: StoreState) => state.account);
  const [loadingConfirmPassword, setLoadingConfirmPassword] = useState<boolean>(false);
  const [loadingUpdateAccount, setLoadingUpdateAccount] = useState<boolean>(false);

  const onFinishUpdateAccount = (form: { name: string; email: string }) => {
    setLoadingUpdateAccount(true);
    dispatch(updateAccount(form));
    setLoadingUpdateAccount(false);
  };

  const onFinishUpdatePassword = (form: { password: string; newPassword: string }) => {
    setLoadingConfirmPassword(true);
    dispatch(updateAccountPassword(form));
    setLoadingConfirmPassword(false);
  };

  const isAdmin = account.email === ADMIN_EMAIL;
  const isDemo = process.env.DEMO === "true";

  return (
    <>
      <DashboardSettingsNavigation>
        <PagePanel title="Basic Information">
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
              className="w-1/2"
            >
              {({ register, errors }) => (
                <>
                  <FormItem
                    label="Name"
                    error={errors?.name}
                    disabled={isAdmin || isDemo}
                  >
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
                <Button
                  form="basic-info-form"
                  type="submit"
                  loading={loadingUpdateAccount}
                >
                  Update
                </Button>
              </ButtonContainer>
            )}
          </ColumnSection>
        </PagePanel>

        <PagePanel title="Security">
          <ColumnSection
            title="Update password"
            subtitle="After a successful password update, you will be redirected to the login page where you can log in with your new password."
          >
            <Form
              onSubmit={onFinishUpdatePassword}
              id="update-password-form"
              className="w-1/2"
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
              <Button
                type="submit"
                form="update-password-form"
                loading={loadingConfirmPassword}
              >
                Confirm
              </Button>
            </ButtonContainer>
          </ColumnSection>
        </PagePanel>
        {/* <ColumnSection
          firstColumnWidth={10}
          secondColumnWidth={14}
          title={
            <Typography className="text-red-700">Delete account</Typography>
          }
          subtitle={
            <Space direction="vertical" className="gap-0">
              <Typography>
                Account deletion is immediate and irreversible.
              </Typography>
              <Typography className="font-semibold">
                Performing this operation is possible only when you do not have the owner
                status in any of the apps.
              </Typography>
              <Typography>
                Click <a>here</a> to read more about the account deletion process.
              </Typography>
            </Space>
          }
        >
          <Space className="w-full mb-5">
            <Confirm
              withAuth={true}
              description={"Are you sure that you want to delete your account?"}
              onOk={() => handleDeleteAccount()}
            >
              <Button type="primary" danger>
                Delete account
              </Button>
            </Confirm>
          </Space>
        </ColumnSection> */}
      </DashboardSettingsNavigation>
    </>
  );
};

export default SettingsAccountPage;
