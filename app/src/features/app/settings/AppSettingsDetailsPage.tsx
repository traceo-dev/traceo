import { Form, Space, Input, Button, Typography, Select } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ColumnSection } from "src/core/components/ColumnSection";
import AppSettingsNavigationPage from "src/features/app/settings/components/AppSettingsNavigation";
import { UploadFile, ATTACHMENT_TYPE } from "src/core/components/UploadFile";
import api from "src/core/lib/api";
import { notify } from "src/core/utils/notify";
import { handleStatus } from "src/core/utils/response";
import { dispatch } from "src/store/store";
import { ApiResponse } from "src/types/api";
import { StoreState } from "src/types/store";
import {
  ENVIRONMENT,
  MEMBER_STATUS,
  UpdateApplicationProps
} from "src/types/application";
import { updateAplication } from "../state/actions";
import { useNavigate } from "react-router-dom";
import { Confirm } from "src/core/components/Confirm";
import Permissions from "src/core/components/Permissions";

export const AppSettingsDetailsPage = () => {
  const navigate = useNavigate();
  const { application } = useSelector((state: StoreState) => state.application);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  if (!application) {
    return null;
  }

  const update = (update: UpdateApplicationProps) => {
    dispatch(updateAplication(update));
  };

  const remove = async () => {
    setLoadingDelete(true);
    try {
      const response: ApiResponse<string> = await api.delete(
        `/api/application/${application.id}`
      );
      if (handleStatus(response.status) === "success") {
        notify.success("App successfully deleted");
        navigate("/dashboard/overview");
      } else {
        notify.error("App not deleted. Please try again later.");
      }
    } catch (error) {
      notify.error(error);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <AppSettingsNavigationPage>
      <ColumnSection
        firstColumnWidth={12}
        secondColumnWidth={12}
        divider={true}
        title="Application name"
        subtitle="Name of your application."
      >
        <Form
          onFinish={update}
          name="personalInformation"
          layout="vertical"
          className="w-3/5"
        >
          <Space>
            <Form.Item
              name="name"
              label="Name"
              style={{ width: 300 }}
              className="font-semibold"
              initialValue={application?.name}
            >
              <Input disabled={application?.member?.status === MEMBER_STATUS.DEVELOPER} />
            </Form.Item>
            <Permissions statuses={[MEMBER_STATUS.ADMINISTRATOR, MEMBER_STATUS.OWNER]}>
              <Button htmlType="submit" className="primary-btn mt-2">
                Update
              </Button>
            </Permissions>
          </Space>

          {/* {application.technology && (
            <Form.Item label="Technology" className="font-semibold">
              {handleTechnologyIcon[application.technology]}
              <Typography.Text className="font-normal">
                &nbsp;{handleTechnologyName[application.technology]}
              </Typography.Text>
            </Form.Item>
          )}

          {application.framework && (
            <Form.Item label="Framework" className="font-semibold">
              {handleFrameworkIcon[application.framework]}
              <Typography.Text className="font-normal">
                &nbsp;{handleFrameworkName[application.framework]}
              </Typography.Text>
            </Form.Item>
          )} */}
        </Form>
      </ColumnSection>

      <ColumnSection
        firstColumnWidth={12}
        secondColumnWidth={12}
        divider={true}
        title="Avatar"
        subtitle="Upload app avatar here. Remember that uploaded image can have maximum 2MB."
      >
        <UploadFile
          disabled={application?.member?.status === MEMBER_STATUS.DEVELOPER}
          currentFileUrl={application?.logo}
          onChange={(val) => update({ logo: val })}
          type={ATTACHMENT_TYPE.APPLICATION_AVATAR}
        />
      </ColumnSection>
      <ColumnSection
        firstColumnWidth={12}
        secondColumnWidth={12}
        divider={true}
        title="Default environment"
        subtitle="Set your default environment that you want to see right after open this application."
      >
        <Space direction="vertical" className="w-full">
          <Typography>Environment</Typography>
          <Select
            onChange={(defaultEnv: ENVIRONMENT) => update({ defaultEnv })}
            defaultValue={application?.defaultEnv}
            style={{ minWidth: "408px" }}
            disabled={application?.member?.status === MEMBER_STATUS.DEVELOPER}
          >
            <Select.Option value={ENVIRONMENT.development}>Development</Select.Option>
            <Select.Option value={ENVIRONMENT.production}>Production</Select.Option>
            <Select.Option value={ENVIRONMENT.test}>Test</Select.Option>
          </Select>
        </Space>
      </ColumnSection>
      <Permissions statuses={[MEMBER_STATUS.OWNER]}>
        <ColumnSection
          firstColumnWidth={12}
          secondColumnWidth={12}
          title={<Typography.Text className="text-red-700">Delete app</Typography.Text>}
          subtitle="Note that the removal of the application is immediate and irreversible. Only members with `Owner` membership status can perform this operation."
        >
          <Space className="w-full mb-5">
            <Confirm
              withAuth={true}
              description="Are you sure that you want to remove this app?"
              onOk={() => remove()}
            >
              <Button type="primary" loading={loadingDelete} danger>
                Delete
              </Button>
            </Confirm>
          </Space>
        </ColumnSection>
      </Permissions>
    </AppSettingsNavigationPage>
  );
};

export default AppSettingsDetailsPage;