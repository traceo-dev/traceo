import styled from "styled-components";

export const PickerWrapper = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
`;

export const PickerFooter = styled.div`
  width: 100%;
  padding: 12px;
  justify-content: flex-end;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-top: 1px solid var(--color-bg-secondary);
  text-align: end;
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-bg-secondary);
`;

export const TimeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 1.25rem;
  margin-top: 1.25rem;
  padding-left: 0.75rem; /* 12px */
  padding-right: 0.75rem; /* 12px */
`;

export const Header = styled.div`
  width: 100%;
  padding: 0.75rem; /* 12px */
  border-bottom: 1px solid var(--color-bg-secondary);
`