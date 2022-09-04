import { Space } from "antd";
import { joinClasses } from "src/core/utils/classes";

export const EmptyBody = ({ children, className = "" }) => {
  return <Space className={joinClasses("positoned-div", className)}>{children}</Space>;
};
