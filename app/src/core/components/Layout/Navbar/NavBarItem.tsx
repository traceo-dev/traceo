import { Tooltip } from "antd";
import { joinClasses, conditionClass } from "core/utils/classes";
import { slugifyForUrl } from "core/utils/stringUtils";
import { FC } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { MenuRoute } from "types/navigation";
import { StoreState } from "types/store";

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

  return (
    <Tooltip placement="right" title={label}>
      <NavLink to={handlePath(href)} className="text-inherit">
        <li
          onClick={onClick && (() => onClick())}
          className={joinClasses(
            "flex items-center justify-center h-10 w-10 rounded cursor-pointer mb-3",
            conditionClass(key && isActive(key), "text-white bg-canvas"),
            conditionClass(!disabled, "duration-200 hover:text-white hover:bg-canvas")
          )}
        >
          {icon}
        </li>
      </NavLink>
    </Tooltip>
  );
};
