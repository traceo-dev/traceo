import { Tag, TagColorType } from "core/ui-components/Tag/Tag";
import { joinClasses } from "core/utils/classes";
import { FC } from "react";
import { AccountStatus } from "../../types/accounts";

interface Props {
  status: AccountStatus;
}
export const AccountStatusTag: FC<Props> = ({ status }) => {
  const accountStatusColor: Record<AccountStatus, string> = {
    [AccountStatus.ACTIVE]: "bg-green-700",
    [AccountStatus.INACTIVE]: "bg-blue-700",
    [AccountStatus.DISABLED]: "bg-gray-700"
  };

  return (
    <Tag className={joinClasses("capitalize", accountStatusColor[status])}>{status}</Tag>
  );
};
