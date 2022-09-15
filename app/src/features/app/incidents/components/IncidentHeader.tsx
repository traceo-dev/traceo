import {
  BugOutlined,
  CheckOutlined,
  DownOutlined,
  ScissorOutlined,
  SyncOutlined,
  UserAddOutlined
} from "@ant-design/icons";
import { Space, Typography, Tooltip, Button, Popover } from "antd";
import { AssignMemberPopover } from "core/components/AssignMemberPopover";
import { Avatar } from "core/components/Avatar";
import { Confirm } from "core/components/Confirm";
import api from "core/lib/api";
import { handleStatus } from "core/utils/response";
import { slugifyForUrl } from "core/utils/stringUtils";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { dispatch } from "store/store";
import { ApiResponse } from "types/api";
import { Incident, IncidentStatus } from "types/incidents";
import { StoreState } from "types/store";
import { IncidentStatusTag } from "../../../../core/components/IncidentStatusTag";
import PageHeader from "../../../../core/components/PageHeader";
import { notify } from "../../../../core/utils/notify";
import { updateIncident } from "../state/actions";

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

interface ButtonsProps {
  incident: Incident;
}
const ButtonsSection: FC<ButtonsProps> = ({ incident }) => {
  const { application } = useSelector((state: StoreState) => state.application);

  const navigate = useNavigate();
  const [isVisible, setVisible] = useState<boolean>(false);

  const isAssigned = !!incident?.assigned;

  const update = (update: { [key: string]: any }) => {
    dispatch(updateIncident(update));
  };

  const changeStatus = () => {
    const status =
      incident?.status === IncidentStatus.UNRESOLVED
        ? IncidentStatus.RESOLVED
        : incident?.status === IncidentStatus.RESOLVED
        ? IncidentStatus.UNRESOLVED
        : IncidentStatus.RESOLVED;

    update({ status });
  };

  const remove = async () => {
    const response: ApiResponse<string> = await api.delete(
      `/api/incidents/${incident.id}`
    );
    if (handleStatus(response.status) === "success") {
      notify.success("Incident removed");
      navigate(`/app/${application.id}/${slugifyForUrl(application.name)}/incidents`);
    } else {
      notify.success("Cannot remove incident. Please try again later.");
    }
  };

  return (
    <Space className="w-full mt-2 justify-between">
      <Space>
        <Button onClick={() => changeStatus()} type="primary">
          {incident?.status === IncidentStatus.RESOLVED ? (
            <CheckOutlined />
          ) : (
            <>Resolve</>
          )}
        </Button>
        <Popover
          visible={isVisible}
          placement="bottom"
          content={<AssignMemberPopover setVisible={setVisible} />}
        >
          <Space
            className="w-full justify-start cursor-pointer"
            onClick={() => setVisible(!isVisible)}
          >
            {isAssigned ? (
              <Button
                icon={
                  <Avatar
                    shape="circle"
                    size="small"
                    url={incident?.assigned?.logo}
                    name={incident?.assigned?.name}
                  />
                }
                ghost
              >
                <>
                  {incident?.assigned?.name}
                  <DownOutlined className="text-xs" />
                </>
              </Button>
            ) : (
              <Button ghost>
                <UserAddOutlined />
              </Button>
            )}
          </Space>
        </Popover>
        <Confirm
          onOk={remove}
          description="Are you sure you want to delete this incident?"
        >
          <Button type="primary" icon={<ScissorOutlined />} danger>
            Delete
          </Button>
        </Confirm>
      </Space>
    </Space>
  );
};
