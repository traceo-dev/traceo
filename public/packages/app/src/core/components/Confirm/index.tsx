import api from "../../lib/api";
import { ApiResponse } from "@traceo/types";
import {
  InputSecret,
  Button,
  ButtonContainer,
  Typography,
  Space,
  Alert,
  Modal
} from "@traceo/ui";
import { FC, Fragment, useState } from "react";
import { useUser } from "../../../core/hooks/useUser";

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
  title = "Confirm",
  description,
  children,
  onOk,
  auth = false
}) => {
  const user = useUser();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);
  const [password, setPassword] = useState<string>(null);

  const confirm = async () => {
    if (auth) {
      const props = {
        password,
        username: user.username
      };

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
    <Fragment>
      <Space onClick={() => setOpen(true)}>{children}</Space>
      <Modal open={isOpen} title={title} onCancel={onCancel}>
        <Fragment>
          <Space className="w-full" direction="vertical">
            <Space className="w-full text-sm">{description}</Space>
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
        </Fragment>
      </Modal>
    </Fragment>
  );
};
