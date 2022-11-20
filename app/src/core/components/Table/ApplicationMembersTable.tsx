import { ADMIN_EMAIL } from "../../../core/utils/constants";
import { FC } from "react";
import { ApplicationMember } from "../../../types/application";
import { MemberTableRow } from "./rows/MemberTableRow";
import { TraceoTable } from "./TraceoTable";
import { useMemberRole } from "../../../core/hooks/useMemberRole";
import { Account } from "../../../types/accounts";

interface Props {
  members: ApplicationMember[];
  execute: () => void;
}
export const ApplicationMembersTable: FC<Props> = ({ members, execute }) => {
  const { isViewer } = useMemberRole();

  const isServerAdmin = (account: Account) => account.email === ADMIN_EMAIL;

  const isEditable = (account: Account) =>
    isServerAdmin(account) || isViewer ? false : true;

  return (
    <TraceoTable columns={["Name", "Email", "Role"]}>
      {members?.map((member, index) => (
        <MemberTableRow
          key={index}
          type="account"
          item={member}
          editable={isEditable(member["account"])}
          postExecute={() => execute()}
        />
      ))}
    </TraceoTable>
  );
};
