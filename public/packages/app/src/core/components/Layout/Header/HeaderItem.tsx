import { useProject } from "../../../hooks/useProject";
import { MenuRoute } from "../../../types/navigation";
import { StoreState } from "@store/types";
import { Row } from "@traceo/ui";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";

export interface HeaderItemProps {
  route: MenuRoute;
}
export const HeaderItem = ({ route }: HeaderItemProps) => {
  const { project } = useProject();
  const { incident } = useSelector((state: StoreState) => state.incident);
  const location = useLocation();

  const { label, onClick, href, key, badge } = route;

  const isActivePath = (key: string) => {
    if (!key) {
      return false;
    }
    return location.pathname.split("/").includes(key);
  };

  const parsePath = () => href.replace(":id", project?.id).replace(":iid", incident?.id);

  const handleOnClick = () => onClick && onClick();

  return (
    <NavLink to={parsePath()} className="text-inherit">
      <Wrapper onClick={handleOnClick} isActive={key && isActivePath(key)}>
        <Row className="w-full px-1">
          {<span className="pl-3 cursor-pointer text-sm">{label}</span>}
          <div className="pr-2">{badge}</div>
        </Row>
      </Wrapper>
    </NavLink>
  );
};

const Wrapper = styled.div<{
  isActive: boolean;
}>`
  list-style: none;
  position: relative;
  display: flex;
  color: rgba(255, 255, 255, 0.85);
  padding-top: 4px;
  padding-bottom: 4px;
  margin: 4px;
  border-radius: 18px;
  display: block;
  height: 100%;
  font-size: 14px;
  cursor: pointer;
  font-weight: 400;

  &:hover {
    color: #ffffff;
    background-color: var(--color-bg-secondary);
  }

  ${(p) =>
    p.isActive &&
    `
      color: #ffffff;
      background-color: var(--color-bg-secondary);
    `}
`;
