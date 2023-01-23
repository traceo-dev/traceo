import { FC } from "react";
import styled from "styled-components";

const ScrollbarView = styled.div`
  position: relative;
  overflow: scroll;
  overflow-x: hidden;
  display: flex;
  -webkit-box-flex: 1;
  flex-grow: 1;
  flex-direction: column;
  height: 100%;
`;

const ScrollbarContent = styled.div`
  display: block;
  min-height: 100%;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 48px;
  padding-top: 20px;
`;

export const Page: FC = ({ children }) => {
  return (
    <ScrollbarView>
      <ScrollbarContent>{children}</ScrollbarContent>
    </ScrollbarView>
  );
};
