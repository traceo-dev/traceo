import { Modal, Space, Typography } from "antd";
import api from "../../../core/lib/api";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { ApiResponse } from "../../../types/api";
import { StoreState } from "../../../types/store";
import { InputSecret } from "core/ui-components/Input/InputSecret";
import { Button } from "core/ui-components/Button/Button";
import { Form } from "core/ui-components/Form/Form";
import { FormItem } from "core/ui-components/Form/FormItem";
import { ButtonContainer } from "core/ui-components/Button/ButtonContainer";

interface CheckCredentialsResponse {
  isCorrect: boolean;
}
interface Props {
  title?: string;
  description: string | JSX.Element;
  children: any;
  onOk: () => void;
  auth?: boolean;
}
export const Confirm: FC<Props> = ({
  title = "",
  description,
  children,
  onOk,
  auth = false
}) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const { account } = useSelector((state: StoreState) => state.account);

  const confirm = async ({ password }: { password: string }) => {
    if (auth) {
      const props = {
        username: account.username,
        password
      };

      const resp: ApiResponse<CheckCredentialsResponse> = await api.post(
        "/api/auth/check",
        props
      );

      if (resp.status === "error") {
        return;
      }
    }

    onOk();
    setOpen(false);
  };

  return (
    <>
      <Space onClick={() => setOpen(true)}>{children}</Space>
      <Modal open={isOpen} title={title} closable={false} footer={null}>
        <Space className="w-full" direction="vertical">
          <Space className="w-full text-md">{description}</Space>
          {auth && (
            <Space className="w-full pt-5" direction="vertical">
              <Typography.Text>
                To perform this operation, please enter the password below and confirm.
              </Typography.Text>
              <Form onSubmit={confirm} id="confirm-password-form">
                {({ register, errors }) => (
                  <FormItem error={errors?.password}>
                    <InputSecret
                      {...register("password", {
                        required: true
                      })}
                      placeholder="Password"
                    />
                  </FormItem>
                )}
              </Form>
            </Space>
          )}
        </Space>
        <ButtonContainer>
          <Button type="submit" form="confirm-password-form">
            OK
          </Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </ButtonContainer>
      </Modal>
    </>
  );
};
