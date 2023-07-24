import { FC, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { NotificationContainer } from "../Notification/NotificationContainer";
import { useUser } from "../../../core/hooks/useUser";
import { Navbar } from "./Navbar";
import Header from "./Header";
import { useLocation } from "react-router-dom";

const Overlay = styled.div`
  width: 100%;
  height: 100%
    ${(props) =>
      props.visible &&
      css`
        background-color: var(--color-bg-secondary);
        inset: 80px 0px 0px;
        position: fixed;
        opacity: 50%;
        visibility: visible;
      `};
`;

const MainBody = styled.div`
  position: relative;
  flex: 1 1 0%;
  min-height: calc(100vh - 80px);
  overflow-y: hidden;
`;

export const AppWrapper: FC = ({ children }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState<boolean>(true);
  const { isLoggedIn } = useUser();

  const location = useLocation();
  const isOverlay = !isSidebarCollapsed && isLoggedIn;

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    setSidebarCollapsed(true);
  }, [location]);

  return (
    <div className="flex flex-col relative min-h-screen">
      <Header isCollapsed={isSidebarCollapsed} toggleSidebar={() => toggleSidebar()} />

      <NotificationContainer />

      <div className="flex">
        <Navbar isCollapsed={isSidebarCollapsed} />
        <Overlay visible={isOverlay} onClick={() => isOverlay && setSidebarCollapsed(true)}>
          <MainBody>{children}</MainBody>
        </Overlay>
      </div>
    </div>
  );
};
