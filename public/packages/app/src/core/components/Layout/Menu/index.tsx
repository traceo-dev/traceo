import { FC } from "react";
import { MenuItem } from "./MenuItem";
import { joinClasses } from "../../../utils/classes";
import { MenuRoute } from "../../../types/navigation";

interface Props {
  routes: MenuRoute[];
  className?: string;
}
export const Menu: FC<Props> = ({ routes, className }) => {
  return (
    <nav className={joinClasses("relative flex h-10", className)}>
      {routes
        .filter((route) => !route.private)
        .map((menu, index) => (
          <MenuItem menu={menu} key={index} />
        ))}
    </nav>
  );
};
