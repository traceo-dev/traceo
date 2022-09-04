import { CheckCircleFilled, EditOutlined, CloseOutlined } from "@ant-design/icons";
import { Typography, Row, Space, Popconfirm } from "antd";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import {
  AccountApplication,
  ApplicationMember,
  MEMBER_STATUS
} from "src/types/application";
import { removeMember } from "src/features/app/members/state/actions";
import { Avatar } from "../../../../core/components/Avatar";
import { EditMemberDrawer } from "../../../../core/components/Drawers/EditMemberDrawer";
import { MemberStatusTag } from "../../../../core/components/MemberStatusTag";
import { PaginatedTable } from "../../../../core/components/PaginatedTable";
import { dispatch } from "src/store/store";
import { StoreState } from "src/types/store";

interface Props {
  members: AccountApplication[];
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
      title: "Status",
      dataIndex: "status",
      render: (status: MEMBER_STATUS) => <MemberStatusTag status={status} />
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
        <Avatar
          shape="circle"
          size="small"
          url={member?.account?.logo}
          name={member?.account?.name}
        />
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
        <Space>
          {renderEdit(member)}
          {renderTrash(member)}
        </Space>
      </>
    );
  };

  const isEdit = (member: ApplicationMember) =>
    member?.status !== MEMBER_STATUS.OWNER &&
    (account?.status === MEMBER_STATUS.OWNER ||
      account?.status === MEMBER_STATUS.ADMINISTRATOR);

  const renderEdit = (member: ApplicationMember) => {
    if (isEdit(member)) {
      return (
        <EditOutlined
          className="action-icon text-blue-400"
          onClick={() => {
            setEditMember(true);
            setCurrentAccount(member);
          }}
        />
      );
    }
  };

  const isTrash = (member: ApplicationMember) =>
    member?.status !== MEMBER_STATUS.OWNER &&
    (account?.status === MEMBER_STATUS.OWNER ||
      account?.status === MEMBER_STATUS.DEVELOPER) &&
    member?.account.id !== account?.id;

  const renderTrash = (member: ApplicationMember) => {
    if (isTrash(member)) {
      return (
        <Popconfirm
          title="Are you sure?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleRemoveMember(member?.id)}
        >
          <CloseOutlined className="action-icon text-red-500" />
        </Popconfirm>
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
