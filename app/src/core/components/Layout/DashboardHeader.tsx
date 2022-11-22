import { AppstoreOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Space, Tooltip, Typography } from "antd";
import { GH_REPO_LINK } from "../../../core/utils/constants";
import { slugifyForUrl, toTitleCase } from "../../../core/utils/stringUtils";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { StoreState } from "../../../types/store";

export const DashboardHeader = () => {
  const navigate = useNavigate();

  const { application } = useSelector((state: StoreState) => state.application);
  const openQuestionCircle = () => window.open(GH_REPO_LINK, "_blank");

  const breadcrumb = window.location.pathname.split("/");
  const isApp = breadcrumb.includes("app");

  return (
    <>
      <div className="flex h-12 max-h-12 items-center justify-between py-2 px-5 header-border-bottom">
        <Space>
          {isApp && (
            <Space
              className="cursor-pointer"
              onClick={() =>
                navigate(
                  `/app/${application.id}/${slugifyForUrl(application.name)}/overview`
                )
              }
            >
              <AppstoreOutlined />
              <Typography.Text className="text-md">
                {application.name} / {toTitleCase(breadcrumb[4])}
              </Typography.Text>
            </Space>
          )}
        </Space>

        <Tooltip title="Help">
          <Button
            onClick={openQuestionCircle}
            type="ghost"
            icon={<QuestionCircleOutlined />}
            className="dashboard-btn"
          />
        </Tooltip>
      </div>
      <style>{`
        .dashboard-btn {
          padding: 0px 8px;
          border-radius: 8px;
          background-color: var(--color-bg-secondary);
        } 

        .dashboard-btn:hover {
          border-color: var(--color-text-primary);
          color: var(--color-text-primary);
        }
        
        .header-border-bottom {
            border-bottom: 1px solid rgba(204, 204, 220, 0.07)
        }
      `}</style>
    </>
  );
};
