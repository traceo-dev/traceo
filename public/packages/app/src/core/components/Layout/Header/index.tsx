import { useProject } from "../../../hooks/useProject";
import { HeaderItem } from "./HeaderItem";
import { buildHeaderItems } from "./utils";
import styled from "styled-components";
import { useUser } from "../../../../core/hooks/useUser";
import { LeftHeaderSection } from "./LeftHeaderSection";
import { RightHeaderSection } from "./RightHeaderSection";
import { Row } from "@traceo/ui";
import { BackButton } from "./BackButton";

const Header = () => {
  const { project } = useProject();
  const { isAdmin } = useUser();

  const isProjectDashboard = window.location.pathname.split("/").includes("project");

  return (
    <div className="w-full flex flex-col z-50 shadow-lg top-0 fixed">
      <PrimaryHeader>
        <LeftHeaderSection />
        <RightHeaderSection />
      </PrimaryHeader>
      <SecondaryHeader>
        <Row>
          {isProjectDashboard && <BackButton />}
          {buildHeaderItems(isAdmin, project).map((route, key) => (
            <HeaderItem key={key} route={route} />
          ))}
        </Row>
      </SecondaryHeader>
    </div>
  );
};

const PrimaryHeader = styled.header`
  display: flex;
  padding-inline: 36px;
  height: 40px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-bg-secondary);
`;

const SecondaryHeader = styled.nav`
  width: 100%;
  background-color: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-bg-light-secondary);
  position: relative;
  display: flex;
  align-items: center;
  padding-inline: 18px;
  justify-content: space-between;
`;

export default Header;
