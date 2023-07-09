import { Row } from "@traceo/ui";
import styled from "styled-components";

const Wrapper = styled.div`
  min-width: 180px;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-primary);
  z-index: 999 !important;
  border-radius: 2px;
`;

const Option = styled.div`
  background: none;
  cursor: pointer;
  white-space: nowrap;
  color: rgb(204, 204, 220);
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  padding: 8px 16px;
  min-height: 32px;
  margin: 0px;
  border: none;
  width: 100%;
  position: relative;

  &:hover {
    background-color: var(--color-bg-secondary);
  }
`;

const Header = styled.span`
  padding: 8px 16px;
  font-weight: 500;
  border-bottom: 1px solid var(--color-bg-secondary);
`;

export type PopoverSelectOptionsProps = {
  label: string;
  icon?: JSX.Element;
  onClick?: () => void;
};

interface Props {
  title?: string;
  options: PopoverSelectOptionsProps[];
}
export const PopoverSelectOptions = ({ options, title }: Props) => {
  return (
    <Wrapper>
      {title && <Header>{title}</Header>}
      {options.map((option, key) => (
        <Option key={key} onClick={() => option?.onClick && option?.onClick()}>
          <Row gap="x-3">
            {option.icon}
            {option.label}
          </Row>
        </Option>
      ))}
    </Wrapper>
  );
};
