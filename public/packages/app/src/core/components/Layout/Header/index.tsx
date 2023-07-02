import { useProject } from "../../../hooks/useProject";
import { HeaderItem } from "./HeaderItem";
import { buildHeaderItems } from "./utils";
import styled from "styled-components";
import { useUser } from "../../../../core/hooks/useUser";
import { LeftHeaderSection } from "./LeftHeaderSection";
import { RightHeaderSection } from "./RightHeaderSection";
import { Row, Select } from "@traceo/ui";

export const Header = () => {
  const { project } = useProject();
  const { isAdmin } = useUser();

  return (
    <div className="w-full flex flex-col z-50 shadow-lg top-0 fixed">
      <header className="flex px-8 h-[40px] w-full bg-primary border-bottom justify-between items-center">
        <LeftHeaderSection />
        <RightHeaderSection />
      </header>
      <SecondaryHeader>
        <Row>
          {buildHeaderItems(isAdmin, project).map((route, key) => (
            <HeaderItem key={key} route={route} />
          ))}
        </Row>
      </SecondaryHeader>
    </div>
  );
};

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
