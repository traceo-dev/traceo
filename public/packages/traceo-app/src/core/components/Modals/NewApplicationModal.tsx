import { FC, useState } from "react";
import { CreateApplicationProps } from "../../../types/application";
import { useAppDispatch } from "../../../store";
import { createApplication } from "../../../features/app/state/application/actions";
import { Input, Form, FormItem, Modal } from "@traceo/ui";
interface Props {
  isOpen: boolean;
  onCancel: () => void;
  isAdmin?: boolean;
}
export const NewApplicationModal: FC<Props> = ({ isOpen, onCancel, isAdmin }) => {
  const dispatch = useAppDispatch();

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
        open={isOpen}
        onCancel={onCancel}
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
