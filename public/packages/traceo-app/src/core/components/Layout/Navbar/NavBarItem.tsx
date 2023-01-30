import { Space, Typography } from "@traceo/ui";
import { joinClasses, conditionClass } from "../../../../core/utils/classes";
import { FC } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { MenuRoute } from "../../../../types/navigation";
import { StoreState } from "../../../../types/store";
import { useApplication } from "../../../../core/hooks/useApplication";

interface NavBarItemProps {
  route: MenuRoute;
}
export const NavBarItem: FC<NavBarItemProps> = ({ route }) => {
  const { application } = useApplication();
  const { incident } = useSelector((state: StoreState) => state.incident);

  const { label, disabled, icon, onClick, href, key } = route;

  const isActive = (currentKey: string) => {
    if (!currentKey) {
      return false;
    }
    const paths = window.location.pathname.split("/");
    return paths.includes(currentKey);
  };

  const handlePath = (link: string) =>
    link.replace(":id", String(application?.id)).replace(":iid", incident?.id);

  const NavItem = () => (
    <li
      onClick={onClick && (() => onClick())}
      className={joinClasses(
        "py-2 mx-3 flex cursor-pointer mb-2 rounded-lg",
        conditionClass(key && isActive(key), "text-white bg-primary"),
        conditionClass(!disabled, "duration-200 hover:text-white hover:bg-primary")
      )}
    >
      <Space className="w-full px-3 text-sm">
        {icon}
        <Typography className="pl-2 cursor-pointer">{label}</Typography>
      </Space>
    </li>
  );

  if (!href) {
    return <NavItem />;
  }

  return (
    <NavLink to={handlePath(href)} className="text-inherit">
      <NavItem />
    </NavLink>
  );
};
