import { Tag, TagColorType } from "core/ui-components/Tag/Tag";
import { joinClasses } from "core/utils/classes";
import { FC } from "react";
import { AccountStatus } from "../../types/accounts";

interface Props {
  status: AccountStatus;
  className?: string;
}
export const AccountStatusTag: FC<Props> = ({ status, className }) => {
  const accountStatusColor: Record<AccountStatus, TagColorType> = {
    [AccountStatus.ACTIVE]: "green",
    [AccountStatus.INACTIVE]: "blue",
    [AccountStatus.DISABLED]: "gray"
  };

  return (
    <Tag
      color={accountStatusColor[status]}
      className={joinClasses("capitalize", className)}
    >
      {status}
    </Tag>
  );
};
