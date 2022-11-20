import { Space, Button } from "antd";
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
      <Button loading={loading} type="primary" onClick={() => onSave()}>
        Save
      </Button>
      <Button type="primary" onClick={() => onCancel()} ghost>
        Cancel
      </Button>
    </Space>
  );
};
