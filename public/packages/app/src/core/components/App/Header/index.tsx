import styled, { css } from "styled-components";
import { useUser } from "../../../../core/hooks/useUser";
import { LeftHeaderSection } from "./LeftHeaderSection";
import { RightHeaderSection } from "./RightHeaderSection";
import { Row } from "@traceo/ui";
import { CloseOutlined, HomeFilled, MenuOutlined } from "@ant-design/icons";
import { Fragment, useEffect, useState } from "react";
import { Bradcrumbs } from "./Breadcrumbs";
import { PortalElement } from "../../Portal";
import { Link } from "react-router-dom";
import { useProject } from "../../../../core/hooks/useProject";

interface Props {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}
const Header = ({ isCollapsed = true, toggleSidebar }: Props) => {
  const { isLoggedIn } = useUser();
  const [isShift, setShift] = useState(false);

  const pathSplits = window.location.pathname.split("/");
  const hasHeader =
    isLoggedIn && (pathSplits.includes("project") || pathSplits.includes("dashboard"));

  if (!hasHeader) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setShift(window.pageYOffset >= 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Fragment>
      <PrimaryHeader>
        <LeftHeaderSection />
        <RightHeaderSection />
      </PrimaryHeader>

      <StickyHeader sticky={isShift}>
        <SecondaryHeader>
          <Row>
            <span className="cursor-pointer" onClick={toggleSidebar}>
              {isCollapsed ? <MenuOutlined /> : <CloseOutlined />}
            </span>
            <Bradcrumbs isShift={isShift} />
          </Row>

          <PortalElement id="dashboard-toolbar" />
        </SecondaryHeader>
      </StickyHeader>
    </Fragment>
  );
};

const PrimaryHeader = styled.header`
  display: flex;
  padding-inline: 36px;
  padding-top: 5px;
  padding-bottom: 5px;
  width: 100%;
  height: 40px;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-bg-secondary);
  z-index: 2;
`;

const StickyHeader = styled.nav`
  display: flex;
  flex-direction: column;

  ${(props) =>
    props.sticky &&
    css`
      position: sticky;
      transition: box-shadow 0.2s ease;
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
      z-index: 1100;
      top: 0;
      left: 0;
      right: 0;
    `}
`;

const SecondaryHeader = styled.nav`
  width: 100%;
  height: 40px;
  background-color: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-bg-light-secondary);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 36px;
  transition: box-shadow 0.2s ease;
  z-index: 2;
`;

export default Header;
