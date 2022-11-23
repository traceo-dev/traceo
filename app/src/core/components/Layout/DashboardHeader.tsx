import {
  AppstoreOutlined,
  LoadingOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
import { Space, Tooltip, Typography } from "antd";
import { GH_REPO_LINK } from "../../../core/utils/constants";
import { slugifyForUrl, toTitleCase } from "../../../core/utils/stringUtils";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { StoreState } from "../../../types/store";

export const DashboardHeader = () => {
  const navigate = useNavigate();

  const { application, hasFetched } = useSelector(
    (state: StoreState) => state.application
  );
  const openQuestionCircle = () => window.open(GH_REPO_LINK, "_blank");

  const breadcrumb = window.location.pathname.split("/");
  const isApp = breadcrumb.includes("app");
  const isDashboard = breadcrumb.includes("dashboard");

  if (!isApp && !isDashboard) {
    return null;
  }

  return (
    <>
      <nav className="flex h-12 max-h-12 items-center justify-between py-2 px-5 header-border-bottom">
        <div>
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
                {hasFetched ? application.name : <LoadingOutlined />} /{" "}
                {toTitleCase(breadcrumb[4])}
              </Typography.Text>
            </Space>
          )}
        </div>

        <Tooltip title="Help">
          <QuestionCircleOutlined className="icon-small" onClick={openQuestionCircle} />
        </Tooltip>
      </nav>
      <style>{`
        .header-border-bottom {
            border-bottom: 1px solid rgba(204, 204, 220, 0.07)
        }
      `}</style>
    </>
  );
};
