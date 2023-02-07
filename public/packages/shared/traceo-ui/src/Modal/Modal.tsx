import { FC } from "react";
import { ModalButtons, ModalButtonsProps } from "./ModalButtons";
import Dialog from "rc-dialog";
import "rc-dialog/assets/index.css";

type ModalSizeType = "md" | "lg" | "xl";

const mapModalSize: Record<ModalSizeType, number> = {
  md: 540,
  lg: 780,
  xl: 1020
};

interface ModalProps extends Omit<ModalButtonsProps, "onCancel"> {
  open: boolean;
  title?: string;
  size?: ModalSizeType;
  onCancel?: () => void;
  children: JSX.Element;
}
export const Modal: FC<ModalProps> = (props: ModalProps) => {
  const {
    open,
    title,
    children,
    size = "md",
    formId,
    loading = false,
    onOk,
    onCancel
  } = props;

  const bodyStyle = {
    backgroundColor: "#1b1b28",
    padding: 0
  };

  const maskStyle = {
    zIndex: 1000,
    backgroundColor: "rgba(0,0,0,.45)"
  };

  return (
    <Dialog
      visible={open}
      onClose={onCancel}
      width={mapModalSize[size]}
      bodyStyle={bodyStyle}
      animation="zoom"
      maskAnimation="fade"
      maskStyle={maskStyle}
      closable={false}
      focusTriggerAfterClose={false}
      height="auto"
    >
      {title && (
        <div className="px-6 py-4 border-b border-solid border-t-0 border-r-0 border-l-0 border-light-secondary">
          <span className="font-semibold">{title}</span>
        </div>
      )}

      <div className="p-6 text-sm">
        {children}
        {(formId || onOk) && (
          <ModalButtons
            formId={formId}
            onCancel={onCancel}
            onOk={onOk}
            loading={loading}
          />
        )}
      </div>
    </Dialog>
  );
};
