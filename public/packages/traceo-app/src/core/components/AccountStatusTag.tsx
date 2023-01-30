import { Tag, TagColorType } from "@traceo/ui";
import { joinClasses } from "../../core/utils/classes";
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

  const tagColor: Record<AccountStatus, TagColorType> = {
    [AccountStatus.ACTIVE]: "green",
    [AccountStatus.INACTIVE]: "blue",
    [AccountStatus.DISABLED]: "gray"
  };

  return (
    <Tag
      color={tagColor[status]}
      className={joinClasses("capitalize", accountStatusColor[status])}
    >
      {status}
    </Tag>
  );
};
