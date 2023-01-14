import { FC, useState } from "react";
import { CreateApplicationProps } from "../../../types/application";
import { dispatch } from "../../../store/store";
import { createApplication } from "../../../features/app/state/application/actions";
import { Input } from "core/ui-components/Input";
import { Form } from "core/ui-components/Form";
import { FormItem } from "core/ui-components/Form/FormItem";
import { Modal } from "core/ui-components/Modal";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  isAdmin?: boolean;
}
export const NewApplicationModal: FC<Props> = ({ isOpen, onCancel, isAdmin }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = (form: CreateApplicationProps) => {
    setLoading(true);
    dispatch(createApplication(form, isAdmin));
    setLoading(false);
    onCancel();
  };

  return (
    <>
      <Modal
        title="New application"
        isOpen={isOpen}
        onClose={onCancel}
        formId="create-app-form"
        loading={loading}
      >
        <Form onSubmit={onFinish} id="create-app-form">
          {({ register, errors }) => (
            <FormItem label="Name" error={errors.name}>
              <Input
                {...register("name", {
                  required: true
                })}
              />
            </FormItem>
          )}
        </Form>
      </Modal>
    </>
  );
};
