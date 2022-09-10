import { Row, Space, Layout, Alert } from "antd";
import { FC, useEffect } from "react";
import { loadAccount } from "src/features/auth/state/actions";
import { dispatch } from "src/store/store";
import { BellOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Menu } from "../Menu";
import { MenuRoute } from "src/types/navigation";
import { Profile } from "./components/Profile";
import { AppSwitcher } from "./components/AppSwitcher";
import { EnvironmentSwitcher } from "./components/EnvironmentSwitcher";
import { useSelector } from "react-redux";
import { StoreState } from "src/types/store";

const { Header: AntHeader } = Layout;

interface Props {
  routes: MenuRoute[];
}
export const Header: FC<Props> = ({ routes }) => {
  const { account } = useSelector((state: StoreState) => state.account);

  useEffect(() => {
    dispatch(loadAccount());
  }, []);

  return (
    <>
      <Space direction="vertical" className="gap-0">
        {!account?.isPasswordUpdated && (
          <Alert
            message={
              <Space>
                Your password has not been changed since you created your account. Please
                change your password now.
              </Space>
            }
            type="warning"
            showIcon
            closable
          />
        )}
        <AntHeader className="header">
          <Row className="w-full justify-between">
            <AppSwitcher />
            <Space>
              <EnvironmentSwitcher />
              <QuestionCircleOutlined className="icon-small" />
              <BellOutlined className="icon-small" />
              <Profile />
            </Space>
          </Row>
        </AntHeader>
        <Menu className="mx-9" routes={routes} />
      </Space>
      <style>{`
        .header {
          height: auto;
          padding: 8px;
          line-height: inherit;
          transition: 0.2s;
          background-color: var(--color-bg-primary);
          border-bottom: 1px solid var(--color-border);
        }

        .passwordHeader {
          height: auto;
          padding: 2px;
          padding-inline: 24px;
          background-color: orange;
          width: 100%;
          font-size: 14px;
          color: black;
          justify-content: center;
          font: semibold;
        }
      `}</style>
    </>
  );
};

export default Header;
