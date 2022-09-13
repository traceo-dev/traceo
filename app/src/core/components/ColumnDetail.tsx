import { Space, Typography } from "antd";
import { joinClasses } from "../../core/utils/classes";

export const ColumnDetail = ({ label, value, className = "" }) => {
  return (
    <Space
      direction="vertical"
      style={{ fontSize: "14px", lineHeight: "20px" }}
      className={joinClasses("w-full pb-4", className)}
    >
      <Typography className="text-primary info-label">{label}</Typography>
      {typeof value === "string" || typeof value === "number" ? (
        <Typography className="w-full text-primary font-semibold text-primary">
          {value}
        </Typography>
      ) : (
        value
      )}
    </Space>
  );
};
