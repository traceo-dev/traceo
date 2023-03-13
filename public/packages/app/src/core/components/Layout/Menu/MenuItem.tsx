import { useApplication } from "../../../hooks/useApplication";
import { MenuRoute } from "../../../types/navigation";
import { joinClasses, conditionClass } from "../../../utils/classes";
import { StoreState } from "@store/types";
import { Space } from "@traceo/ui";
import { FC } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

interface Props {
  menu: MenuRoute;
}
export const MenuItem: FC<Props> = ({ menu }) => {
  const { application } = useApplication();
  const { incident } = useSelector((state: StoreState) => state.incident);

  const isActive = (currentKey: string) => {
    const paths = window.location.pathname.split("/");
    return paths.includes(currentKey);
  };

  const handlePath = (link: string) =>
    link.replace(":id", String(application.id)).replace(":iid", incident.id);

  return (
    <NavLink to={handlePath(menu.href)} className="text-inherit">
      <MenuItemWrapper isActive={isActive(menu.key)}>
        <Space>
          {menu.icon}
          {menu.label}
          {menu.badge && (
            <div className="pl-2">{menu.badge}</div>
          )}
        </Space>
      </MenuItemWrapper>
    </NavLink>
  );
};

const MenuItemWrapper = styled.div<{
  isActive: boolean;
}>`
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

  &:hover {
    color: #ffffff;
    border-bottom: 3px solid var(--color-bg-secondary);
  }

  ${(p) =>
    p.isActive &&
    `
    color: #ffffff;
    border-bottom: 3px solid !important;
    border-image: linear-gradient(
      90deg,
      #F59E0B 0.01%,
      #C58A0A 99.99%
    ) !important;
    border-image-slice: 1 !important;
  `}
`;
