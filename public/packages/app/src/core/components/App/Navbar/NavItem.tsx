import styled, { css } from "styled-components";

interface Props {
  icon?: JSX.Element;
  label: string;
  onClick?: () => void;
  active: boolean;
}

const Item = styled.li`
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap-row: 9px;
  padding: 8px;
  font-size: 13px;

  &:hover {
    background-color: var(--color-bg-secondary);
  }

  ${(props) =>
    props.isActive &&
    css`
      color: rgb(6 182 212);
    `}
`;

export const NavItem = ({ label = "", icon = undefined, active = false, onClick }: Props) => {
  return (
    <Item isActive={active} onClick={onClick}>
      {icon && <span className="text-xs mr-1">{icon}</span>}
      {label}
    </Item>
  );
};
