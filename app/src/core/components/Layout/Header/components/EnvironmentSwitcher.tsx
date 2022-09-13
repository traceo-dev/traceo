import { Popover, Space, Tag, Typography } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { conditionClass, joinClasses } from "../../../../../core/utils/classes";
import { slugifyForUrl } from "../../../../../core/utils/stringUtils";
import { StoreState } from "../../../../../types/store";

export const EnvironmentSwitcher = () => {
  const { application } = useSelector((state: StoreState) => state.application);
  const navigate = useNavigate();

  const currentEnv = localStorage.getItem("env") || application?.defaultEnv;
  const isDashboard = !location.pathname.split("/").includes("app");

  const changeApplicationEnvironment = (val: string) => {
    localStorage.setItem("env", val);
    navigate(`/app/${application.id}/${slugifyForUrl(application.name)}/overview`);
    window.location.reload();
  };

  const envs = ["test", "development", "production"];

  const envSelector = (
    <Space direction="vertical">
      {envs.map((env, index) => (
        <Typography.Text
          key={index}
          className={joinClasses(
            "cursor-pointer font-semibold capitalize",
            conditionClass(currentEnv === env, "font-semibold text-cyan-600")
          )}
          onClick={() => changeApplicationEnvironment(env)}
        >
          {env}
        </Typography.Text>
      ))}
    </Space>
  );

  return (
    !isDashboard && (
      <Popover title="Change environment" content={envSelector}>
        <Tag className="capitalize font-medium border-green-500 rounded-full bg-transparent text-green-500 cursor-pointer">
          {currentEnv}
        </Tag>
      </Popover>
    )
  );
};
