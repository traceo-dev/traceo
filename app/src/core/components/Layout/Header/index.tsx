import { Row, Space, Layout } from "antd";
import { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadAccount } from "src/features/auth/state/actions";
import { dispatch } from "src/store/store";
import { BellOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Menu } from "../Menu";
import { MenuRoute } from "src/types/navigation";
import { Profile } from "./components/Profile";
import { AppSwitcher } from "./components/AppSwitcher";
import { EnvironmentSwitcher } from "./components/EnvironmentSwitcher";

const { Header: AntHeader } = Layout;

interface Props {
  routes: MenuRoute[];
}
export const Header: FC<Props> = ({ routes }) => {
  useEffect(() => {
    dispatch(loadAccount());
  }, []);

  return (
    <>
      <Space direction="vertical" className="gap-0">
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
      `}</style>
    </>
  );
};

export default Header;
