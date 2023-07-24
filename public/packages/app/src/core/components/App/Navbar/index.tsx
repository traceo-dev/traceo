import { useUser } from "../../../../core/hooks/useUser";
import styled, { css } from "styled-components";
import { useProject } from "../../../../core/hooks/useProject";
import { CollapseNavSection } from "./CollapseNavSection";
import { useEffect } from "react";
import { buildTree } from "./tree";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../store/types";
import { useAppDispatch } from "../../../../store";
import { setNavTree } from "./reducers/navTree";
import { getActiveRoute } from "../utils";
import { NavItem } from "./NavItem";

const SidebarMenu = styled.nav`
  width: 320px;
  display: flex;
  inset: 0px;
  flex-direction: column;
  padding-top: 8px;
  z-index: 1;
  position: fixed;
  border-right: 1px solid var(--color-bg-secondary);
  background-color: var(--color-bg-canvas);
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;

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
    <div className="relative flex">
      <SidebarMenu isCollapsed={isCollapsed}>
        <div className="relative flex flex-col pt-[80px] overflow-y-auto">
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
                      icon={item?.icon}
                      onClick={() => onSelect(item.url)}
                    />
                  ))}
                </ul>
              )}
            </CollapseNavSection>
          ))}
        </div>
      </SidebarMenu>
    </div>
  );
};
