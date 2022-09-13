import { BugOutlined, SyncOutlined } from "@ant-design/icons";
import { Space, Typography, Tooltip } from "antd";
import { IncidentStatusTag } from "../../../../core/components/IncidentStatusTag";
import PageHeader from "../../../../core/components/PageHeader";
import { notify } from "../../../../core/utils/notify";
import { ButtonsSection } from "./ButtonsSection";

export const IncidentHeader = ({ incident, onExecute }) => {
  const refresh = () => {
    onExecute();
    notify.success("Refreshed");
  };

  return (
    <PageHeader
      title={
        <Space direction="vertical" className="gap-0 w-full">
          <Space className="text-2xs font-semibold text-primary pb-0 mb-0">
            <BugOutlined />
            <Typography.Text>INCIDENT</Typography.Text>
          </Space>
          <Space>
            <Typography.Text className="text-3xl">{incident?.type}</Typography.Text>
            <IncidentStatusTag status={incident?.status} />
          </Space>
        </Space>
      }
      subTitle={<ButtonsSection incident={incident} />}
      extra={
        <>
          <Tooltip title="Refresh">
            <SyncOutlined onClick={refresh} className="text-xs cursor-pointer" />
          </Tooltip>
        </>
      }
    />
  );
};
