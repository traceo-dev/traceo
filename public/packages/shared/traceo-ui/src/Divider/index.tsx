import styled from "styled-components";

interface DividerProps {
  className?: string;
}
export const Divider = ({ className }: DividerProps) => <HRElement className={className} />;

const HRElement = styled.hr`
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid var(--color-bg-secondary);
  margin: 1em 0;
  padding: 0;
`;
