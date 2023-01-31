import { useState } from "react";
import { useAppDispatch } from "../../../store";
import { addServerAccount } from "../../../features/management/state/accounts/actions";
import { AddAccountProps } from "@traceo/types";
import { Input, InputSecret, Form, FormItem, Space, Modal } from "@traceo/ui";
import { clearObject } from "../../utils/object";

export const NewAccountModal = ({ isOpen, onCancel }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = (props: AddAccountProps) => {
    setLoading(true);

    const payload = clearObject<AddAccountProps>(props);
    dispatch(addServerAccount(payload));

    setLoading(false);
    onClose();
  };

  const onClose = () => {
    onCancel();
  };

  return (
    <Modal
      title="New account"
      open={isOpen}
      onCancel={onCancel}
      formId="add-account-form"
      loading={loading}
    >
      <Space
        direction="vertical"
        className="pt-0 px-4 w-full h-full justify-between text-center"
      >
        <Form onSubmit={onFinish} id="add-account-form">
          {({ register, errors }) => (
            <>
              <FormItem label="Username" error={errors.username}>
                <Input
                  {...register("username", {
                    required: true
                  })}
                />
              </FormItem>
              <FormItem label="Name" error={errors.name}>
                <Input
                  {...register("name", {
                    required: false
                  })}
                />
              </FormItem>
              <FormItem label="Email" error={errors.email}>
                <Input
                  {...register("email", {
                    required: false,
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address"
                    }
                  })}
                />
              </FormItem>
              <FormItem label="Password" error={errors.password}>
                <InputSecret
                  {...register("password", {
                    required: true,
                    pattern: {
                      value: /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
                      message: "This password is too weak"
                    }
                  })}
                />
              </FormItem>
            </>
          )}
        </Form>
      </Space>
    </Modal>
  );
};
