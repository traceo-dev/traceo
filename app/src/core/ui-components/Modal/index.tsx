import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment } from "react";
import { ModalButtons, ModalButtonsProps } from "./ModalButtons";

interface ModalProps extends Omit<ModalButtonsProps, "onCancel"> {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: JSX.Element;
}
export const Modal: FC<ModalProps> = (props: ModalProps) => {
  const { isOpen, title, onClose, children, formId, loading, onOk } = props;
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex pt-[5%] justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  style={{ minWidth: "520px" }}
                  className="bg-primary w-full max-w-md transform overflow-hidden rounded-md text-left align-middle shadow-xl transition-all"
                >
                  {title && (
                    <Dialog.Title className="py-2 px-5 border-l-0 border-r-0 border-t-0 border border-solid border-b-light-secondary">
                      <span className="text-[16px] font-semibold">{title}</span>
                    </Dialog.Title>
                  )}

                  <div className="py-5 px-8 text-md">
                    {children}
                    {(formId || onOk) && (
                      <ModalButtons
                        formId={formId}
                        onCancel={onClose}
                        onOk={onOk}
                        loading={loading}
                      />
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
