import { QuestionCircleOutlined } from "@ant-design/icons";
import { Space, Tooltip } from "antd";
import { GH_REPO_LINK } from "../../../core/utils/constants";
import { useNavigate } from "react-router-dom";
import { TraceoLogo } from "../Icons/TraceoLogo";

export const DashboardHeader = () => {
  const navigate = useNavigate();

  const openQuestionCircle = () => window.open(GH_REPO_LINK, "_blank");

  const breadcrumb = window.location.pathname.split("/");
  const isApp = breadcrumb.includes("app");
  const isDashboard = breadcrumb.includes("dashboard");

  if (!isApp && !isDashboard) {
    return null;
  }

  return (
    <>
      <nav className="flex h-12 max-h-12 items-center justify-between py-2 px-5 header-border z-10 bg-canvas">
        <Space className="w-full">
          <TraceoLogo
            name={true}
            size="small"
            className="cursor-pointer"
            onClick={() => navigate("/dashboard/overview")}
          />
        </Space>
        <Space>
          <Tooltip title="Help">
            <QuestionCircleOutlined className="icon-small" onClick={openQuestionCircle} />
          </Tooltip>
        </Space>
      </nav>
      <style>{`
        .header-border {
          border-bottom: 1px solid var(--color-bg-secondary) !important;
        }
      `}</style>
    </>
  );
};
