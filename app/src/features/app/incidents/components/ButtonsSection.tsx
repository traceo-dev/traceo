import {
  CheckOutlined,
  DownOutlined,
  ScissorOutlined,
  UserAddOutlined
} from "@ant-design/icons";
import { Button, Popover, Space } from "antd";
import { FC, useState } from "react";
import api from "src/core/lib/api";
import { ApiResponse } from "src/types/api";
import { Incident, IncidentStatus } from "src/types/incidents";
import { notify } from "src/core/utils/notify";
import { handleStatus } from "src/core/utils/response";
import { useNavigate } from "react-router-dom";
import { AssignMemberPopover } from "src/core/components/AssignMemberPopover";
import { Avatar } from "src/core/components/Avatar";
import { dispatch } from "src/store/store";
import { useSelector } from "react-redux";
import { StoreState } from "src/types/store";
import { updateIncident } from "../state/actions";
import { Confirm } from "src/core/components/Confirm";
import { slugifyForUrl } from "src/core/utils/stringUtils";

interface Props {
  incident: Incident;
}
export const ButtonsSection: FC<Props> = ({ incident }) => {
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
                <Space>
                  {incident?.assigned?.name}
                  <DownOutlined className="text-xs" />
                </Space>
              </Button>
            ) : (
              <Button ghost>
                <UserAddOutlined />
              </Button>
            )}
          </Space>
        </Popover>

        {/* <Popover
          visible={isReleaseVisible}
          content={<AssignReleasePopover setVisible={setReleaseVisible} />}
          placement="bottom"
          trigger="click"
        >
          <Button onClick={() => setReleaseVisible(!isReleaseVisible)} ghost>
            {incident?.resolved ? (
              <>
                <TagOutlined className="pr-2" />
                {incident?.resolved.version}
              </>
            ) : (
              <>
                <TagOutlined />
                <PlusOutlined className="pl-2 text-xs" />
              </>
            )}
          </Button>
        </Popover> */}
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
