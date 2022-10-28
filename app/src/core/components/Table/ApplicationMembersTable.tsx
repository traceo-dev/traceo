import { ADMIN_EMAIL } from "../../../core/utils/constants";
import { FC } from "react";
import { ApplicationMember } from "../../../types/application";
import { MemberTableRow } from "./rows/MemberTableRow";
import { TraceoTable } from "./TraceoTable";

interface Props {
  members: ApplicationMember[];
  execute: () => void;
}
export const ApplicationMembersTable: FC<Props> = ({ members, execute }) => (
  <TraceoTable columns={["Name", "Email", "Role"]}>
    {members?.map((member, index) => (
      <MemberTableRow
        key={index}
        type="account"
        item={member}
        editable={member.account.email !== ADMIN_EMAIL}
        postExecute={execute}
      />
    ))}
  </TraceoTable>
);
