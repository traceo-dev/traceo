import { FC } from "react";
import styled from "styled-components";

const Wrapper = styled.div<{
  isHeader: boolean;
}>`
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;

  ${(p) => (p.isHeader ? ` padding-top: 60px ` : `padding-top: 0px`)};
`;

export const TraceoAppWrapper: FC = ({ children }) => {
  const isHeaderLess =
    window.location.pathname.split("/").includes("project") ||
    window.location.pathname.split("/").includes("dashboard");

  return (
    <Wrapper isHeader={isHeaderLess}>
      <div className="flex w-full flex-col overflow-x-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </Wrapper>
  );
};
