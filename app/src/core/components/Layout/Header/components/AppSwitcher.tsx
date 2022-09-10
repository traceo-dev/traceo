import { DownOutlined, LoadingOutlined } from "@ant-design/icons";
import { Popover, Space, Tag, Typography } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar } from "src/core/components/Avatar";
import { StoreState } from "src/types/store";
import { ApplicationMember } from "src/types/application";
import { conditionClass, joinClasses } from "src/core/utils/classes";
import { TraceoLogo } from "src/core/components/Icons/TraceoLogo";
import { slugifyForUrl } from "src/core/utils/stringUtils";
import { useEffect } from "react";
import { dispatch } from "src/store/store";
import { loadApplications } from "src/features/dashboard/state/actions";
import { loadApplication } from "src/features/app/state/actions";

export const AppSwitcher = () => {
  const navigate = useNavigate();
  const { application, hasFetched } = useSelector(
    (state: StoreState) => state.application
  );
  const { applications } = useSelector((state: StoreState) => state.applications);
  const isDashboard = !location.pathname.split("/").includes("app");

  useEffect(() => {
    dispatch(loadApplications());
  }, []);

  const selectApp = (app: ApplicationMember) => {
    const { application } = app;
    localStorage.setItem("env", application.defaultEnv);

    // TODO: for some reason with using navigate first is 404 view and then go to the app overview
    // navigate(`/app/${application.id}/${slugifyForUrl(application.name)}/overview`);
    window.location.href = `/app/${application.id}/${slugifyForUrl(
      application.name
    )}/overview`;
  };

  const appSelector = !selectApp ? (
    <LoadingOutlined />
  ) : (
    applications?.map((app: ApplicationMember, index) => (
      <Space key={index} className="py-2 w-full">
        <Typography.Text
          className={joinClasses(
            "cursor-pointer",
            conditionClass(
              app.application.id === application.id,
              "font-semibold text-cyan-600"
            )
          )}
          onClick={() => selectApp(app)}
        >
          {app.application.name}
        </Typography.Text>
      </Space>
    ))
  );

  return (
    <>
      <Space className="pl-5">
        {!isDashboard ? (
          <Popover
            trigger={["click"]}
            placement="bottomRight"
            title="Change app"
            content={appSelector}
          >
            <Space className="cursor-pointer">
              {!hasFetched ? (
                <LoadingOutlined />
              ) : (
                <>
                  <Avatar size="small" name={application.name} url={application.logo} />
                  <Typography.Text className="appName">
                    {application.name}
                  </Typography.Text>
                  <DownOutlined className="text-xs" />
                </>
              )}
            </Space>
          </Popover>
        ) : (
          <Space>
            <TraceoLogo
              onClick={() => navigate("/dashboard/overview")}
              size="small"
              withName={true}
            />
            <Tag className="border-orange-500 rounded-full bg-transparent text-orange-500 font-medium">
              Preview
            </Tag>
          </Space>
        )}
      </Space>

      <style>{`
        .appName {
            font-feature-settings: "pnum";
            font-variant: proportional-nums;
            line-height: 16px;
            font-weight: 500;
            font-size: 12px;
        }
    `}</style>
    </>
  );
};
