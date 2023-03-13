import { Avatar } from "@traceo/ui";
import { useUser } from "src/core/hooks/useUser";

export const UserProfilePopover = () => {
  const user = useUser();

  return (
    <div className="flex flex-row w-full justify-between items-center">
      <Avatar size="sm" alt={user.name} src={user.gravatar} />
      <div className="flex flex-col text-start pl-2">
        <span className="font-semibold">{user.name}</span>
        <span className="text-xs">{user.email}</span>
      </div>
    </div>
  );
};
