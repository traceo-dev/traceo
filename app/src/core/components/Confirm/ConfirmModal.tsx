import { Button, Space } from "antd";
import Modal from "antd/lib/modal/Modal";

export const ConfirmModal = ({ title = "", description, visible, onOk, onCancel }) => {
  return (
    <Modal
      visible={visible}
      title={title}
      closable={false}
      footer={
        <>
          <Button onClick={onCancel} type="default">
            Cancel
          </Button>
          <Button onClick={onOk} type="primary">
            Confirm
          </Button>
        </>
      }
    >
      <Space className="w-full">{description}</Space>
    </Modal>
  );
};
