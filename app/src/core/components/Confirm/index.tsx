import { Modal } from "antd";
import api from "../../../core/lib/api";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { ApiResponse } from "../../../types/api";
import { StoreState } from "../../../types/store";
import { InputSecret } from "core/ui-components/Input/InputSecret";
import { Button } from "core/ui-components/Button/Button";
import { ButtonContainer } from "core/ui-components/Button/ButtonContainer";
import { Typography } from "core/ui-components/Typography/Typography";
import { Space } from "core/ui-components/Space/Space";
import { Alert } from "core/ui-components/Alert/Alert";

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
  const [isError, setError] = useState<boolean>(false);
  const [password, setPassword] = useState<string>(null);

  const confirm = async () => {
    if (auth) {
      const props = {
        password
      };

      console.log("props: ", props);
      const resp: ApiResponse<CheckCredentialsResponse> = await api.post(
        "/api/auth/check",
        props
      );

      if (!resp.data.isCorrect) {
        setError(true);
        return;
      }
    }

    onOk();
    setOpen(false);
  };

  const onCancel = () => {
    setOpen(false);
    setPassword(null);
    setError(false);
  };

  return (
    <>
      <Space onClick={() => setOpen(true)}>{children}</Space>
      <Modal open={isOpen} title={title} closable={false} footer={null}>
        <Space className="w-full" direction="vertical">
          <Space className="w-full text-md">{description}</Space>
          {auth && (
            <Space className="w-full pt-5" direction="vertical">
              <Typography>
                To perform this operation, please enter the password below and confirm.
              </Typography>
              <InputSecret
                className="mt-5"
                onChange={(e) => setPassword(e.currentTarget.value)}
                placeholder="Password"
              />
            </Space>
          )}
        </Space>
        {isError && (
          <Alert
            className="mt-5"
            type="error"
            title="Bad password. Please provide the correct one to perform this operation."
          />
        )}
        <ButtonContainer className="mt-5">
          <Button disabled={auth && !password} type="submit" onClick={confirm}>
            OK
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </ButtonContainer>
      </Modal>
    </>
  );
};
