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
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Tooltip, conditionClass, joinClasses } from "@traceo/ui";

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
      background-color: var(--color-bg-primary);
      transform: translateX(-92%);
    `}
`;

const ToggleIcon = styled.button`
  position: absolute;
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-bg-light-secondary);
  border-radius: 10%;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  top: 105px;
  right: -10px;
  cursor: pointer;
  font-size: 12px;
  padding: 6px;
  z-index: 1200;

  &:hover {
    background-color: var(--color-bg-primary);
    border-color: var(--color-bg-secondary);
  }
`;

interface Props {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}
export const Navbar = ({ isCollapsed, toggleSidebar }: Props) => {
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
        <Tooltip placement="right" title="Toggle sidebar">
          <ToggleIcon onClick={() => toggleSidebar()}>
            {isCollapsed ? <RightOutlined /> : <LeftOutlined />}
          </ToggleIcon>
        </Tooltip>

        <div
          className={joinClasses(
            "relative flex flex-col pt-[80px] overflow-y-auto",
            conditionClass(isCollapsed, "overflow-y-hidden pointer-events-none")
          )}
        >
          {navTree.map((treeRoot, index) => (
            <CollapseNavSection
              key={index}
              expandIcon={treeRoot.items.length > 0}
              icon={treeRoot?.icon as JSX.Element}
              title={treeRoot.label}
              url={treeRoot.url}
              deafultCollapsed={treeRoot.collapsed ?? false}
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
