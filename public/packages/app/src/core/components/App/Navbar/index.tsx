import { useUser } from "../../../../core/hooks/useUser";
import styled, { css } from "styled-components";
import { useProject } from "../../../../core/hooks/useProject";
import { CollapseNavSection } from "./CollapseNavSection";
import { useEffect } from "react";
import { buildTree } from "./tree";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { NavItem } from "./NavItem";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../store/types";
import { useAppDispatch } from "../../../../store";
import { setNavTree } from "./reducers/navTree";
import { getActiveRoute } from "../utils";

const Nav = styled.nav<{ isCollapsed: boolean }>`
  height: calc(100vh - 80px);
  width: 320px;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0px;
  z-index: 1100;
  background-color: var(--color-bg-primary);
  border-right: 1px solid var(--color-bg-secondary);
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  overflow-y: auto;
  padding-block: 20px;

  ${(props) =>
    props.isCollapsed &&
    css`
      transform: translateX(-100%);
    `}
`;

interface Props {
  isCollapsed: boolean;
}
export const Navbar = ({ isCollapsed }: Props) => {
  const { id } = useParams();
  const { project, permission, dashboards } = useProject();

  const user = useUser();

  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();
  const navTree = useSelector((state: StoreState) => state.navTree.navTree);

  useEffect(() => {
    const tree = buildTree({
      dashboards,
      project,
      permission,
      user
    });

    dispatch(setNavTree(tree));
  }, [id, project, location, dashboards]);

  const activeRoute = getActiveRoute(navTree, location.pathname);

  if (!user.isLoggedIn) {
    return null;
  }

  const onSelect = (path: string) => {
    navigate(path);
  };

  return (
    <Nav isCollapsed={isCollapsed}>
      {navTree.map((treeRoot, index) => (
        <CollapseNavSection
          key={index}
          expandIcon={treeRoot.items.length > 0}
          icon={treeRoot?.icon as JSX.Element}
          title={treeRoot.label}
          url={treeRoot.url}
          active={treeRoot?.id === activeRoute.mainItem?.id}
        >
          {treeRoot.items.length > 0 && (
            <ul className="list-none p-0 m-0">
              {treeRoot.items.map((item, index) => (
                <NavItem
                  key={index}
                  active={item?.id === activeRoute.subItem?.id}
                  label={item.label}
                  onClick={() => onSelect(item.url)}
                />
              ))}
            </ul>
          )}
        </CollapseNavSection>
      ))}
    </Nav>
  );
};
