import { useNavigate } from "react-router-dom";
import { TraceoLogo } from "../Icons/TraceoLogo";
import { Space, Link, Typography } from "@traceo/ui";
import { GH_REPO_LINK, VERSION } from "../../utils/constants";
import { GithubOutlined } from "@ant-design/icons";
import { useConfig } from "../../../core/contexts/ConfigsContextProvider";

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const configs = useConfig();

  const breadcrumb = window.location.pathname.split("/");
  const isApp = breadcrumb.includes("app");
  const isDashboard = breadcrumb.includes("dashboard");

  if (!isApp && !isDashboard) {
    return null;
  }

  return (
    <nav className="flex h-12 max-h-12 items-center justify-between py-2 px-5 border-l-0 border-t-0 border-r-0 border-b border-solid border-secondary z-10 bg-canvas">
      <Space>
        <TraceoLogo
          name={true}
          size="small"
          className="cursor-pointer"
          onClick={() => navigate("/dashboard/overview")}
        />
        {configs.demoMode && (
          <div className="ml-3 px-2 py-0.5 bg-blue-900 text-blue-100 rounded-lg text-xs font-semibold">
            Demo
          </div>
        )}
      </Space>
      <Space className="items-center">
        <Typography className="mr-4">v{VERSION}</Typography>
        <Link href={GH_REPO_LINK} target="_blank" className="text-primary">
          <GithubOutlined />
        </Link>
      </Space>
    </nav>
  );
};
