import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { Confirm } from "../../../../core/components/Confirm";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { AddToProjectModal } from "../../../../core/components/Modals/AddToProjectModal";
import { membersAction } from "../../../../core/lib/api/members";
import { ADMIN_EMAIL } from "../../../../core/utils/constants";
import { StoreState } from "@store/types";
import { ProjectMember, MemberProject, MemberRole } from "@traceo/types";
import { Button, Card, Space, Table, TableColumn, Avatar, Select } from "@traceo/ui";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useReactQuery } from "../../../../core/hooks/useReactQuery";

export const UserApplications = () => {
  const { user } = useSelector((state: StoreState) => state.adminUser);
  const [isOpenAddAppDrawer, setOpenAddAppDrawer] = useState<boolean>(false);

  const isAdmin = user.email === ADMIN_EMAIL;

  const {
    data: projects = [],
    refetch,
    isLoading
  } = useReactQuery<MemberProject[]>({
    queryKey: ["user_projects"],
    url: "/api/member/projects",
    params: { userId: user.id }
  });

  const options = [
    { label: "Administrator", value: MemberRole.ADMINISTRATOR },
    { label: "Maintainer", value: MemberRole.MAINTAINER },
    { label: "Viewer", value: MemberRole.VIEWER }
  ];

  const onUpdateRole = async (member: ProjectMember, role: MemberRole) => {
    await membersAction.onUpdateRole(member, role, () => refetch());
  };

  const onRemoveFromProject = async (member: ProjectMember) => {
    await membersAction.onRemoveFromProject(member, () => refetch());
  };

  return (
    <>
      <Card
        title="Applications list"
        extra={
          !isAdmin && (
            <Space className="w-full justify-end">
              <Button onClick={() => setOpenAddAppDrawer(true)}>Add user to project</Button>
            </Space>
          )
        }
      >
        <ConditionalWrapper
          emptyView={<DataNotFound label="No projects found" />}
          isEmpty={projects?.length === 0}
          isLoading={isLoading}
        >
          <Table collection={projects} striped>
            <TableColumn width={15}>
              {({ item }) => <Avatar size="sm" src={item?.gravatar} alt={item?.name} />}
            </TableColumn>
            <TableColumn name="Name" value="name" />
            <TableColumn name="Role" className="py-0">
              {({ item }) => {
                if (user.email === ADMIN_EMAIL) {
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
                if (user.email !== ADMIN_EMAIL) {
                  return (
                    <Confirm
                      description="Are you sure you want to remove this user from project?"
                      onOk={() => onRemoveFromProject(item)}
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

        <AddToProjectModal
          isOpen={isOpenAddAppDrawer}
          onCancel={() => setOpenAddAppDrawer(false)}
          postExecute={() => refetch()}
        />
      </Card>
    </>
  );
};
