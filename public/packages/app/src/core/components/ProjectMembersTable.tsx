import { useProject } from "../hooks/useProject";
import { useUser } from "../hooks/useUser";
import { membersAction } from "../lib/api/members";
import { ADMIN_EMAIL } from "../utils/constants";
import { Confirm } from "./Confirm";
import { CheckCircleFilled } from "@ant-design/icons";
import { MemberRole, ProjectMember } from "@traceo/types";
import { Avatar, Button, Select, Table, TableColumn, Tooltip } from "@traceo/ui";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  collection: ProjectMember[];
  postExecute: () => void;
  className?: string;
}
export const ProjectMembersTable: FC<Props> = ({ collection, postExecute, className }) => {
  const user = useUser();
  const { permission } = useProject();

  const navigate = useNavigate();

  const options = [
    { label: "Administrator", value: MemberRole.ADMINISTRATOR },
    { label: "Maintainer", value: MemberRole.MAINTAINER },
    { label: "Viewer", value: MemberRole.VIEWER }
  ];

  const onUpdateRole = async (member: ProjectMember, role: MemberRole) => {
    await membersAction.onUpdateRole(member, role, () => postExecute());
  };

  const onRemoveFromProject = async (member: ProjectMember) => {
    await membersAction.onRemoveFromProject(member, () => {
      postExecute();

      if (member?.userId === user.id) {
        navigate("/dashboard/projects");
      }
    });
  };
  return (
    <Table className={className} collection={collection} striped>
      <TableColumn width={5}>
        {({ item }) => <Avatar size="sm" src={item?.gravatar} alt={item?.name} />}
      </TableColumn>
      <TableColumn name="Name" value="name">
        {({ item }) => (
          <div className="flex flex-row">
            <span>{item.name}</span>
            {item?.userId === user?.id && (
              <Tooltip placement="bottom" title="It's you!">
                <CheckCircleFilled className="p-1 text-amber-600" />
              </Tooltip>
            )}
          </div>
        )}
      </TableColumn>
      <TableColumn name="Email" value="email" />
      <TableColumn name="Role" className="py-0">
        {({ item }) => {
          if (item.email === ADMIN_EMAIL || permission === MemberRole.VIEWER) {
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
          if (item.email !== ADMIN_EMAIL && permission !== MemberRole.VIEWER) {
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
  );
};
