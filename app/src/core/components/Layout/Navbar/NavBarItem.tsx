import { Space } from "core/ui-components/Space/Space";
import { joinClasses, conditionClass } from "../../../../core/utils/classes";
import { slugifyForUrl } from "../../../../core/utils/stringUtils";
import { FC } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { MenuRoute } from "../../../../types/navigation";
import { StoreState } from "../../../../types/store";
import { Typography } from "core/ui-components/Typography/Typography";

interface NavBarItemProps {
  route: MenuRoute;
}
export const NavBarItem: FC<NavBarItemProps> = ({ route }) => {
  const { application } = useSelector((state: StoreState) => state.application);
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
    link
      .replace(":id", String(application.id))
      .replace(":slug", slugifyForUrl(application?.name))
      .replace(":iid", incident.id);

  const NavItem = () => (
    <li
      onClick={onClick && (() => onClick())}
      className={joinClasses(
        "py-2 mx-3 flex cursor-pointer mb-3 rounded-lg",
        conditionClass(key && isActive(key), "text-white bg-primary"),
        conditionClass(!disabled, "duration-200 hover:text-white hover:bg-primary")
      )}
    >
      <Space className="w-full px-3 text-md">
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
