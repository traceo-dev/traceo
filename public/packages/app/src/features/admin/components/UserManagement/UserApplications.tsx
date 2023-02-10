import { useState } from "react";
import { useSelector } from "react-redux";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { useRequest } from "../../../../core/hooks/useRequest";
import { ApplicationMember, MemberApplication, MemberRole } from "@traceo/types";
import { StoreState } from "@store/types";

import { AddToApplicationModal } from "../../../../core/components/Modals/AddToApplicationModal";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { ADMIN_EMAIL } from "../../../../core/utils/constants";
import { Button, Card, Space, Table, TableColumn, Avatar, Select } from "@traceo/ui";
import { Confirm } from "../../../../core/components/Confirm";
import { membersAction } from "../../../../core/lib/api/members";

export const UserApplications = () => {
  const { account } = useSelector((state: StoreState) => state.serverAccounts);
  const [isOpenAddAppDrawer, setOpenAddAppDrawer] = useState<boolean>(false);

  const isAdmin = account.email === ADMIN_EMAIL;

  const {
    data: applications = [],
    execute: postExecute,
    isLoading
  } = useRequest<MemberApplication[]>({
    url: "/api/amr/applications",
    params: {
      accountId: account.id
    }
  });

  const options = [
    { label: "Administrator", value: MemberRole.ADMINISTRATOR },
    { label: "Maintainer", value: MemberRole.MAINTAINER },
    { label: "Viewer", value: MemberRole.VIEWER }
  ];

  const onUpdateRole = async (member: ApplicationMember, role: MemberRole) => {
    await membersAction.onUpdateRole(member, role, () => postExecute());
  };

  const onRemoveFromApp = async (member: ApplicationMember) => {
    await membersAction.onRemoveFromApp(member, () => postExecute());
  };

  return (
    <>
      <Card
        title="Applications list"
        extra={
          !isAdmin && (
            <Space className="w-full justify-end">
              <Button onClick={() => setOpenAddAppDrawer(true)}>
                Add user to application
              </Button>
            </Space>
          )
        }
      >
        <ConditionalWrapper
          emptyView={<DataNotFound label="No applications found" />}
          isEmpty={applications?.length === 0}
          isLoading={isLoading}
        >
          <Table collection={applications} striped>
            <TableColumn width={15}>
              {({ item }) => <Avatar size="sm" src={item?.gravatar} alt={item?.name} />}
            </TableColumn>
            <TableColumn name="Name" value="name" />
            <TableColumn name="Role" className="py-0">
              {({ item }) => {
                if (account.email === ADMIN_EMAIL) {
                  return <span>{item.role}</span>;
                }

                return (
                  <div className="max-w-min">
                    <Select
                      isDisabled={item.email === ADMIN_EMAIL}
                      onChange={(opt) => onUpdateRole(item, opt?.value)}
                      defaultValue={item.role}
                      options={options}
                      menuPlacement="auto"
                    />
                  </div>
                );
              }}
            </TableColumn>
            <TableColumn width={100} />
            <TableColumn width={50}>
              {({ item }) => {
                if (account.email !== ADMIN_EMAIL) {
                  return (
                    <Confirm
                      description="Are you sure you want to remove this user from app?"
                      onOk={() => onRemoveFromApp(item)}
                    >
                      <Button size="xs" variant="danger">
                        Remove
                      </Button>
                    </Confirm>
                  );
                }
              }}
            </TableColumn>
          </Table>
        </ConditionalWrapper>

        <AddToApplicationModal
          isOpen={isOpenAddAppDrawer}
          onCancel={() => setOpenAddAppDrawer(false)}
          postExecute={() => postExecute()}
        />
      </Card>
    </>
  );
};
