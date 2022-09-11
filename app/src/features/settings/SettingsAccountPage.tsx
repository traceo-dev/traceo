import { Button, Form, Input, Space, Typography } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ColumnSection } from "src/core/components/ColumnSection";
import { StoreState } from "src/types/store";
import { dispatch } from "src/store/store";
import {
  updateAccount,
  updateAccountPassword,
  deleteAccount
} from "src/features/app/settings/state/actions";
import { DashboardSettingsNavigation } from "src/features/settings/components/DashboardSettingsNavigation";
import { Confirm } from "src/core/components/Confirm";

const SettingsAccountPage = () => {
  const { account } = useSelector((state: StoreState) => state.account);
  const [loadingConfirmPassword, setLoadingConfirmPassword] = useState<boolean>(false);
  const [loadingUpdateAccount, setLoadingUpdateAccount] = useState<boolean>(false);

  const onFinishUpdateAccount = (form: { name: string, email: string }) => {
    setLoadingUpdateAccount(true);
    dispatch(updateAccount(form));
    setLoadingUpdateAccount(false);
  };

  const onFinishUpdatePassword = (form: { password: string; newPassword: string }) => {
    setLoadingConfirmPassword(true);
    dispatch(updateAccountPassword(form));
    setLoadingConfirmPassword(false);
  };

  // const handleDeleteAccount = () => {
  //   dispatch(deleteAccount());
  // };

  return (
    <>
      <DashboardSettingsNavigation>
        <ColumnSection
          firstColumnWidth={10}
          secondColumnWidth={14}
          title="Personal information"
          subtitle="This information will appear on your profile."
          divider={true}
        >
          <Form
            onFinish={onFinishUpdateAccount}
            name="personalInformation"
            layout="vertical"
            className="w-3/5"
          >
            <Form.Item name="name" label="Name" initialValue={account?.name}>
              <Input />
            </Form.Item>

            <Form.Item name="email" label="Email" initialValue={account?.email}>
              <Input />
            </Form.Item>

            <Button htmlType="submit" loading={loadingUpdateAccount} type="primary">
              Update
            </Button>
          </Form>
        </ColumnSection>
        <ColumnSection
          firstColumnWidth={10}
          secondColumnWidth={14}
          title="Update password"
          subtitle="After a successful password update, you will be redirected to the login page where you can log in with your new password."
          divider={true}
        >
          <Form
            onFinish={onFinishUpdatePassword}
            name="updatePassword"
            layout="vertical"
            className="w-3/5"
          >
            <Form.Item
              name="password"
              label="Current password"
              requiredMark={"optional"}
              rules={[{ required: true, message: "This field is required" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New password"
              requiredMark={"optional"}
              rules={[{ required: true, message: "This field is required" }]}
            >
              <Input.Password />
            </Form.Item>

            <Button htmlType="submit" loading={loadingConfirmPassword} type="primary">
              Confirm
            </Button>
          </Form>
        </ColumnSection>
        {/* <ColumnSection
          firstColumnWidth={10}
          secondColumnWidth={14}
          title={
            <Typography.Text className="text-red-700">Delete account</Typography.Text>
          }
          subtitle={
            <Space direction="vertical" className="gap-0">
              <Typography.Paragraph>
                Account deletion is immediate and irreversible.
              </Typography.Paragraph>
              <Typography.Paragraph className="font-semibold">
                Performing this operation is possible only when you do not have the owner
                status in any of the apps.
              </Typography.Paragraph>
              <Typography.Text>
                Click <a>here</a> to read more about the account deletion process.
              </Typography.Text>
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
