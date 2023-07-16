import styled, { css } from "styled-components";

interface Props {
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
      background-color: var(--color-bg-secondary);
      color: #ffffff;
    `}
`;

export const NavItem = ({ label, active, onClick }: Props) => {
  return (
    <Item isActive={active} onClick={onClick}>
      {label}
    </Item>
  );
};
