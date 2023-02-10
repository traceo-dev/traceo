import { Tag, TagColorType } from "@traceo/ui";
import { joinClasses } from "../utils/classes";
import { FC } from "react";
import { UserStatus } from "@traceo/types";

interface Props {
  status: UserStatus;
}
export const UserStatusTag: FC<Props> = ({ status }) => {
  const userStatusColor: Record<UserStatus, string> = {
    [UserStatus.ACTIVE]: "bg-green-700",
    [UserStatus.INACTIVE]: "bg-blue-700",
    [UserStatus.DISABLED]: "bg-gray-700"
  };

  const tagColor: Record<UserStatus, TagColorType> = {
    [UserStatus.ACTIVE]: "green",
    [UserStatus.INACTIVE]: "blue",
    [UserStatus.DISABLED]: "gray"
  };

  return (
    <Tag
      color={tagColor[status]}
      className={joinClasses("capitalize", userStatusColor[status])}
    >
      {status}
    </Tag>
  );
};
