import { useApplication } from "../../../hooks/useApplication";
import { MenuRoute } from "../../../types/navigation";
import { StoreState } from "@store/types";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";

export interface NavBarItemProps {
  route: MenuRoute;
}
export const NavbarItem = ({ route }: NavBarItemProps) => {
  const { application } = useApplication();
  const { incident } = useSelector((state: StoreState) => state.incident);
  const location = useLocation();

  const { label, icon, onClick, href, key } = route;

  const isActivePath = (key: string) => {
    if (!key) {
      return false;
    }
    return location.pathname.split("/").includes(key);
  };

  const parsePath = () => href.replace(":id", application.id).replace(":iid", incident.id);

  const handleOnClick = () => onClick && onClick();

  const NavItem = () => (
    <ItemWrapper onClick={handleOnClick} isActive={key && isActivePath(key)}>
      <div className="px-3 flex flex-row w-full items-center">
        <div className="text-center text-sm">{icon}</div>
        {<span className="pl-3 cursor-pointer text-sm">{label}</span>}
      </div>
    </ItemWrapper>
  );

  if (!href) {
    return <NavItem />;
  }

  return (
    <NavLink to={parsePath()} className="text-inherit">
      <NavItem />
    </NavLink>
  );
};

const ItemWrapper = styled.li<{
  isActive: boolean;
}>`
  transition-duration: 0.2s;
  padding-bottom: 0.5rem;
  padding-top: 0.5rem;
  --tw-bg-opacity: 1;
  cursor: pointer;
  display: flex;
  margin-bottom: 0.25rem;
  margin-top: 0.25rem;
  border-radius: 0.5rem !important;
  margin-inline: 0.75rem;
  color: var(--color-text-primary);

  &:hover {
    background-color: var(--color-bg-primary);
  }

  ${(p) =>
    p.isActive &&
    `
    background-color: var(--color-bg-primary);
    color: #ffffff;

    &:hover {
      background-color: var(--color-bg-secondary);
    }
  `}
`;
