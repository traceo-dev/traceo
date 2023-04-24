import { Button } from "../Button";
import styled from "styled-components";

interface Props {
  onSubmit: (e: any) => void;
  disabledApplyBtn?: boolean;
}
export const CalendarFooter = ({ onSubmit, disabledApplyBtn = false }: Props) => {
  return (
    <PickerFooter>
      <Button disabled={disabledApplyBtn} size="xs" onClick={onSubmit}>
        Apply
      </Button>
    </PickerFooter>
  );
};

const PickerFooter = styled.div`
  width: 100%;
  padding: 12px;
  justify-content: flex-end;
  align-items: center;
  border-top: 1px solid var(--color-bg-secondary);
  text-align: end;
  background-color: var(--color-bg-primary);
`;
