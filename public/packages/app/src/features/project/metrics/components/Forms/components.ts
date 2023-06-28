import styled from "styled-components";

export const AddSerieBtn = styled.div`
  padding: 6px;
  margin: 5px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  transition-duration: 200ms;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  text-align: center;
  justify-content: center;
  align-items: center;
  gap: 15px;

  &:hover {
    background-color: var(--color-bg-light-secondary);
  }
`;
