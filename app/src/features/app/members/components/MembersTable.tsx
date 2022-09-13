import { CheckCircleFilled } from "@ant-design/icons";
import { Typography, Row, Space, Button } from "antd";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { ApplicationMember, MemberRole } from "../../../../types/application";
import { removeMember } from "../../../../features/app/members/state/actions";
import { Avatar } from "../../../../core/components/Avatar";
import { EditMemberDrawer } from "../../../../core/components/Drawers/EditMemberDrawer";
import { MemberStatusTag } from "../../../../core/components/MemberStatusTag";
import { PaginatedTable } from "../../../../core/components/PaginatedTable";
import { dispatch } from "../../../../store/store";
import { StoreState } from "../../../../types/store";
import { Permissions } from "core/components/Permissions";
import { Confirm } from "core/components/Confirm";

interface Props {
  members: ApplicationMember[];
  hasFetched?: boolean;
}
export const MembersTable: FC<Props> = ({ members, hasFetched }) => {
  const { account } = useSelector((state: StoreState) => state.account);

  const [openEditMember, setEditMember] = useState<boolean>(false);
  const [currentAccount, setCurrentAccount] = useState<ApplicationMember>(null);

  const columns = [
    {
      title: "Name",
      render: (member: ApplicationMember) => renderProfile(member)
    },
    {
      title: "Email",
      render: (member: ApplicationMember) => (
        <Typography className="text-xs">{member?.account?.email}</Typography>
      )
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (status: MemberRole) => <MemberStatusTag status={status} />
    },
    {
      align: "right" as const,
      width: "50",
      render: (data: ApplicationMember) => renderActions(data)
    }
  ];

  const renderProfile = (member: ApplicationMember) => {
    return (
      <Row className="w-full items-center">
        <Avatar shape="circle" size="small" name={member?.account?.name} />
        <Space>
          <Typography className="pl-2 text-primary">{member?.account?.name}</Typography>
          {member?.account?.id === account?.id && <CheckCircleFilled className="p-1" />}
        </Space>
      </Row>
    );
  };

  const renderActions = (member: ApplicationMember) => {
    return (
      <>
        <Permissions statuses={[MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER]}>
          {renderEdit(member)}
          {renderTrash(member)}
        </Permissions>
      </>
    );
  };

  const isEdit = (_member: ApplicationMember) => true;

  const renderEdit = (member: ApplicationMember) => {
    if (isEdit(member)) {
      return (
        <Button
          onClick={() => {
            setEditMember(true);
            setCurrentAccount(member);
          }}
          type="primary"
          className="mr-2"
        >
          Edit
        </Button>
      );
    }
  };

  const isTrash = (_member: ApplicationMember) => true;

  const renderTrash = (member: ApplicationMember) => {
    if (isTrash(member)) {
      return (
        <Confirm
          onOk={() => handleRemoveMember(member?.id)}
          description={
            <Typography.Text>
              Are you sure that you want to remove {member.account.name} from this app?
            </Typography.Text>
          }
        >
          <Button type="primary" danger>
            Remove
          </Button>
        </Confirm>
      );
    }
  };

  const handleRemoveMember = (memberId: string) => {
    dispatch(removeMember(memberId));
  };

  return (
    <>
      <PaginatedTable loading={!hasFetched} columns={columns} dataSource={members} />

      <EditMemberDrawer
        isOpen={openEditMember}
        onCancel={() => {
          setEditMember(false);
          setCurrentAccount(null);
        }}
        member={currentAccount}
      />
    </>
  );
};
