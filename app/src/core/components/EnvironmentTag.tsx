import { Tag } from "antd";
import { joinClasses } from "../../core/utils/classes";
import { ENVIRONMENT } from "../../types/application";

export const envStatusColor: Record<ENVIRONMENT, string> = {
  [ENVIRONMENT.test]: "text-cyan bg-cyan-700 border-cyan-100",
  [ENVIRONMENT.development]: "text-violet bg-violet-700 border-violet-100",
  [ENVIRONMENT.production]: "text-orange bg-orange-700 border-orange-100"
};

export const EnvironmentTag = ({ env, className = "" }) => {
  return (
    <Tag
      className={joinClasses(
        envStatusColor[env],
        "font-semibold rounded-sm border-0 capitalize",
        className
      )}
    >
      {env}
    </Tag>
  );
};
