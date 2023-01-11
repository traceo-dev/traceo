import { Modal } from "antd";
import { useState } from "react";
import { dispatch } from "../../../store/store";
import { addServerAccount } from "../../../features/management/state/accounts/actions";
import { AddAccountProps } from "../../../types/accounts";
import { Input } from "core/ui-components/Input/Input";
import { InputSecret } from "core/ui-components/Input/InputSecret";
import { Form } from "core/ui-components/Form/Form";
import { FormItem } from "core/ui-components/Form/FormItem";
import { ButtonContainer } from "core/ui-components/Button/ButtonContainer";
import { Button } from "core/ui-components/Button/Button";
import { clearObject } from "core/utils/object";
import { Space } from "core/ui-components/Space/Space";

export const NewAccountModal = ({ isOpen, onCancel }) => {
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
    <>
      <Modal
        title="New account"
        open={isOpen}
        closable={false}
        footer={null}
        onCancel={onClose}
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
          <ButtonContainer>
            <Button loading={loading} type="submit" form="add-account-form">
              OK
            </Button>
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </ButtonContainer>
        </Space>
      </Modal>
    </>
  );
};
