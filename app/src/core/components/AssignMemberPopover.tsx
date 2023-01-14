import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import { useEffect, useState } from "react";
import { useApi } from "../../core/lib/useApi";
import { dispatch } from "../../store/store";
import { updateIncident } from "../../features/app/incidents/state/actions";
import { useSelector } from "react-redux";
import { StoreState } from "../../types/store";
import { ApplicationMember } from "../../types/application";
import { Typography } from "core/ui-components/Typography/Typography";
import { Space } from "core/ui-components/Space/Space";
import { Avatar } from "core/ui-components/Avatar/Avatar";

export const AssignMemberPopover = ({ setVisible }) => {
  const { application } = useSelector((state: StoreState) => state.application);
  const [search, setSearch] = useState<string>(null);

  const queryParams = {
    id: application?.id,
    search,
    take: 5
  };

  const {
    data: members = [],
    isLoading,
    execute: get
  } = useApi<ApplicationMember[]>({
    url: "/api/amr/members",
    params: queryParams
  });

  useEffect(() => {
    get();
  }, [search]);

  // TODO: use condition-wrapper
  const content = isLoading ? (
    <Space className="justify-center w-full">
      <LoadingOutlined />
    </Space>
  ) : members?.length > 0 ? (
    members?.map((member, index) => (
      <Space
        onClick={() => handleIncidentMember({ assignedId: member.id })}
        key={index}
        className="w-full main-hover p-2 rounded-md cursor-pointer"
      >
        <Avatar size="sm" src={member?.gravatar} alt={member?.name} />
        <Typography size="xs" className="pl-1">
          {member?.name}
        </Typography>
      </Space>
    ))
  ) : (
    <Typography size="xs">Not found</Typography>
  );

  const handleIncidentMember = (update: { [key: string]: any }) => {
    dispatch(updateIncident(update));
    setVisible(false);
  };

  return (
    <>
      <Space direction="vertical" className="w-full">
        <Typography weight="semibold">Select member</Typography>
        <Divider className="p-0 m-0" />
        <Space direction="vertical" className="w-full">
          {content}
          <Divider className="m-0" />
          <Space
            onClick={() => handleIncidentMember({ assigned: null })}
            className="text-xs p-2 w-full main-hover rounded-md cursor-pointer"
          >
            <DeleteOutlined />
            Remove assignmend
          </Space>
        </Space>
      </Space>
    </>
  );
};
