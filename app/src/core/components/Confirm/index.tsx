import { Space } from "antd";
import { FC, useState } from "react";
import { ConfirmModal } from "./ConfirmModal";
import { ConfirmModalWithAuth } from "./ConfirmModalWithAuth";

interface Props {
  description: string | JSX.Element;
  children: any;
  onOk: () => void;
  withAuth?: boolean;
}
export const Confirm: FC<Props> = ({ description, children, onOk, withAuth = false }) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOk = () => {
    onOk();
    setOpen(false);
  };

  return (
    <>
      <Space onClick={() => setOpen(true)}>{children}</Space>
      {!withAuth ? (
        <ConfirmModal
          onCancel={() => setOpen(false)}
          onOk={() => handleOk()}
          description={description}
          visible={isOpen}
        />
      ) : (
        <ConfirmModalWithAuth
          onCancel={() => setOpen(false)}
          onOk={handleOk}
          description={description}
          visible={isOpen}
        />
      )}
    </>
  );
};
