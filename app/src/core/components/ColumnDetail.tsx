import { Space, Typography } from "antd";
import { joinClasses } from "../../core/utils/classes";

export const ColumnDetail = ({ label, value, className = "" }) => {
  return (
    <Space
      direction="vertical"
      className={joinClasses("w-full pb-4 gap-0 pr-3", className)}
    >
      <Typography className="text-primary info-label">{label}</Typography>
      {typeof value === "string" || typeof value === "number" ? (
        <Typography className="w-full font-semibold text-link">{value}</Typography>
      ) : (
        value
      )}
    </Space>
  );
};
