import { DeleteOutlined, LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { Divider, Input, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { useApi } from "src/core/lib/useApi";
import { Avatar } from "./Avatar";
import { dispatch } from "src/store/store";
import { updateIncident } from "src/features/app/incidents/state/actions";
import { useSelector } from "react-redux";
import { StoreState } from "src/types/store";
import { ApplicationMember } from "src/types/application";

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

  const content = isLoading ? (
    <Space className="justify-center w-full">
      <LoadingOutlined />
    </Space>
  ) : members?.length > 0 ? (
    members?.map((member, index) => (
      <Space
        onClick={() => handleIncidentMember({ assignedId: member.account.id })}
        key={index}
        className="w-full main-hover p-2 rounded-md cursor-pointer"
      >
        <Avatar
          shape="circle"
          size="small"
          name={member?.account?.name}
        />
        <Typography className="text-xs">{member?.account?.name}</Typography>
      </Space>
    ))
  ) : (
    <Typography.Text className="text-xs">Not found</Typography.Text>
  );

  const handleIncidentMember = (update: { [key: string]: any }) => {
    dispatch(updateIncident(update));
    setVisible(false);
  };

  return (
    <>
      <Space direction="vertical" className="w-full">
        <Typography className="text-md font-semibold">Select member</Typography>
        <Input
          size="small"
          className="min-w-full mt-2"
          value={search}
          onChange={(val) => setSearch(val.target.value)}
          prefix={<SearchOutlined />}
        />
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
