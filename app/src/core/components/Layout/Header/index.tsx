import { Row, Space, Layout, Alert } from "antd";
import { FC, useEffect } from "react";
import { loadAccount } from "../../../../features/auth/state/actions";
import { dispatch } from "../../../../store/store";
import { Menu } from "../Menu";
import { MenuRoute } from "../../../../types/navigation";
import { Profile } from "./components/Profile";
import { AppSwitcher } from "./components/AppSwitcher";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../types/store";
import { isEmptyObject } from "../../../../core/utils/object";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { GH_REPO_LINK } from "../../../../core/utils/constants";

const { Header: AntHeader } = Layout;

interface Props {
  routes: MenuRoute[];
}
export const Header: FC<Props> = () => {
  useEffect(() => {
    dispatch(loadAccount());
  }, []);

  const openQuestionCircle = () => window.open(GH_REPO_LINK, "_blank");

  return (
    <>
      <Space direction="vertical" className="gap-0">
        <AntHeader className="header">
          <Row className="w-full justify-between">
            <AppSwitcher />
            <Space>
              <QuestionCircleOutlined
                onClick={openQuestionCircle}
                className="icon-small"
              />
              <Profile />
            </Space>
          </Row>
        </AntHeader>
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
