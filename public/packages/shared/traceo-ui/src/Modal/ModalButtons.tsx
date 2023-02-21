import { Button } from "../Button/Button";
import { ButtonContainer } from "../Button/ButtonContainer";
import { FC } from "react";

export interface ModalButtonsProps {
  formId?: string;
  loading?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
}
export const ModalButtons: FC<ModalButtonsProps> = (props: ModalButtonsProps) => {
  const { formId, loading, onCancel, onOk } = props;
  return (
    <ButtonContainer className="pt-5">
      {(onOk || formId) && (
        <Button onClick={onOk && onOk} loading={loading} form={formId} type="submit">
          OK
        </Button>
      )}

      {onCancel && (
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </ButtonContainer>
  );
};
