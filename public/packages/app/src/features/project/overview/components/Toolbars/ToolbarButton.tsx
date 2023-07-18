import { ButtonHTMLAttributes } from "react";
import styled, { css } from "styled-components";

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size" | "onClick"> {
  icon?: JSX.Element;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const Button = styled.button<{ isActive: boolean; isDisabled: boolean; isName: boolean }>`
  display: flex;
  flex-direction: row;
  border-radius: 2px;
  border: none;
  cursor: pointer;
  user-select: none;
  color: var(--color-text-primary);
  white-space: no-wrap;

  font-size: 12px;
  font-weight: 500;

  text-align: center;
  justify-content: center;
  align-items: center;

  background-color: var(--color-bg-secondary);

  &:hover {
    background-color: var(--color-bg-light-secondary);
  }

  ${(props) =>
    props.isActive &&
    css`
      background-color: var(--color-traceo-primary);
      color: var(--color-bg-primary);
    `}

  ${(props) =>
    props.isDisabled &&
    css`
      pointer-events: none;
      cursor: default;
      opacity: 50%;
    `}

  ${(props) =>
    !props.isName
      ? css`
          padding: 3px;
          padding-inline: 6px;
          gap: 0px;
        `
      : css`
          padding-inline: 8px;
          padding-top: 2px;
          padding-bottom: 2px;
          gap: 6px;
        `}
`;

export const ToolbarButton = ({
  icon = undefined,
  onClick = undefined,
  disabled = false,
  name = undefined,
  isActive = false,
  className = "",
  ...rest
}: Props) => {
  return (
    <Button
      className={className}
      isActive={isActive}
      isDisabled={disabled}
      isName={!!name}
      onClick={() => onClick()}
      {...rest}
    >
      <span>{icon}</span>
      <span>{name}</span>
    </Button>
  );
};
