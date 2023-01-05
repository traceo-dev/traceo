import { Space } from "antd";
import { Button } from "core/ui-components/Button/Button";
import { FC } from "react";

interface ActionButtonsProps {
  loading: boolean;
  onSave: () => void;
  onCancel: () => void;
}
export const RowActionButtons: FC<ActionButtonsProps> = ({
  loading,
  onSave,
  onCancel
}) => {
  return (
    <Space>
      <Button size="xs" loading={loading} onClick={() => onSave()}>
        Save
      </Button>
      <Button size="xs" variant="ghost" onClick={() => onCancel()}>
        Cancel
      </Button>
    </Space>
  );
};
