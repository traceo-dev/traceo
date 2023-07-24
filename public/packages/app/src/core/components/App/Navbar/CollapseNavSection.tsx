import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  user-select: none;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  cursor: pointer;
  padding-inline: 20px;
  padding-top: 8px;
  padding-bottom: 8px;

  &:hover {
    background-color: var(--color-bg-secondary);
  }

  ${(props) =>
    props.isActive &&
    css`
      color: var(--color-text-active);
    `}
`;

const HaderInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 14px;
`;

const Body = styled.div`
  overflow-y: auto;
  padding-inline: 14px;
  border-left: 1px solid var(--color-bg-secondary);
  margin-left: 28px;
  padding-top: 5px;
  max-height: 180px;
  direction: rtl;
`;

const BodyContent = styled.div`
  direction: ltr;
`;

const CollapseIcon = styled.span`
  border-radius: 4px;
  font-size: 8px;
  display: flex;
  padding: 6px;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;

  &:hover {
    background-color: var(--color-bg-primary);
  }
`;

interface Props {
  title?: string | JSX.Element;
  icon?: JSX.Element;
  expandIcon?: boolean;
  deafultCollapsed?: boolean;
  children?: JSX.Element | JSX.Element[];
  url: string;
  active: boolean;
}
export const CollapseNavSection = ({
  title = undefined,
  icon = undefined,
  children,
  deafultCollapsed = false,
  expandIcon = true,
  url = undefined,
  active = false
}: Props) => {
  const navigate = useNavigate();
  const [isCollapsed, setCollapsed] = useState<boolean>(deafultCollapsed);

  const collapseIcon = isCollapsed ? <DownOutlined /> : <UpOutlined />;

  const onClick = () => navigate(url);

  const toggleSidebar = (e: any) => {
    e.stopPropagation();
    setCollapsed(!isCollapsed);
  };

  return (
    <Wrapper>
      <HeaderWrapper isActive={active} onClick={() => onClick()}>
        <HaderInfo>
          <span className="text-[16px]">{icon}</span>
          <span className="font-normal">{title}</span>
        </HaderInfo>

        {expandIcon && <CollapseIcon onClick={toggleSidebar}>{collapseIcon}</CollapseIcon>}
      </HeaderWrapper>

      {!isCollapsed && (
        <Body>
          <BodyContent>{children}</BodyContent>
        </Body>
      )}
    </Wrapper>
  );
};
