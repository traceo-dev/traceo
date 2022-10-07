import { FC } from "react";
import { useSelector } from "react-redux";
import { joinClasses, conditionClass } from "../../../../core/utils/classes";
import { MenuRoute } from "../../../../types/navigation";
import { StoreState } from "../../../../types/store";
import { NavLink } from "react-router-dom";
import { Space } from "antd";
import { slugifyForUrl } from "../../../../core/utils/stringUtils";

interface Props {
  menu: MenuRoute;
}
export const MenuItem: FC<Props> = ({ menu }) => {
  const { application } = useSelector((state: StoreState) => state.application);
  const { incident } = useSelector((state: StoreState) => state.incident);

  const isActive = (currentKey: string) => {
    const paths = window.location.pathname.split("/");
    return paths.includes(currentKey);
  };

  const handlePath = (link: string) =>
    link
      .replace(":id", String(application.id))
      .replace(":slug", slugifyForUrl(application?.name))
      .replace(":iid", incident.id);

  return (
    <>
      <NavLink to={handlePath(menu.href)} className="text-inherit">
        <div
          className={joinClasses(
            "menuItem",
            conditionClass(isActive(menu.key), "menuItemActive")
          )}
        >
          <Space>
            {menu.icon}
            {menu.label}
          </Space>
        </div>
      </NavLink>
      <style>{`
      .menuItem {
        list-style: none;
        position: relative;
        display: flex;
        color: rgba(255, 255, 255, 0.85);
        padding: 12px 22px 8px;
        display: block;
        height: 100%;
        font-size: 14px;
        cursor: pointer;
        font-weight: 400;
      }

      .menuItem:hover {
        color: #ffffff;
        border-bottom: 3px solid var(--color-bg-secondary);
      }

      .menuItemActive {
        color: #ffffff;
        border-bottom: 3px solid !important;
        border-image: linear-gradient(
          90deg,
          var(--color-primary) 0.01%,
          var(--color-secondary) 99.99%
        ) !important;
        border-image-slice: 1 !important;
      }
      `}</style>
    </>
  );
};
