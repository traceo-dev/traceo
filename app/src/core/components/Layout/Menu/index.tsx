import { FC } from "react";
import { MenuRoute } from "../../../../types/navigation";
import { MenuItem } from "./MenuItem";
import { joinClasses } from "../../../../core/utils/classes";

interface Props {
  routes: MenuRoute[];
  className?: string;
}
export const Menu: FC<Props> = ({ routes, className }) => {
  return (
    <>
      <nav className={joinClasses("menu", className)}>
        {routes.map((menu, index) => (
          <MenuItem menu={menu} key={index} />
        ))}
      </nav>
      <style>{`
        .menu {
          position: relative;
          display: flex;
          height: 41px;
          border-bottom: 1px solid var(--color-border);
        }        
      `}</style>
    </>
  );
};
