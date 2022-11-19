import { Tag } from "antd";
import { joinClasses } from "../../core/utils/classes";
import { AccountStatus } from "../../types/accounts";

export const AccountStatusTag = ({ status }) => {
  const accountStatusColor: Record<AccountStatus, string> = {
    [AccountStatus.ACTIVE]: "text-white bg-green-700",
    [AccountStatus.INACTIVE]: "text-white bg-blue-700",
    [AccountStatus.DISABLED]: "text-white bg-gray-500"
  };

  return (
    <Tag
      className={joinClasses(
        accountStatusColor[status],
        "font-semibold rounded-sm border-0 capitalize"
      )}
    >
      {status}
    </Tag>
  );
};
