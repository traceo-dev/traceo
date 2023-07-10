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

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-primary);
  position: relative;
  border: 1px solid var(--color-bg-secondary);
  border-radius: 2px;
`;

export const Header = styled.div`
  width: 100%;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-inline: 8px;
  font-weight: 500;
  font-size: 14px;
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-bg-secondary);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
