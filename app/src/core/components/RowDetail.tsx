import { Space, Typography } from "antd";
import { joinClasses } from "src/core/utils/classes";

export const RowDetail = ({ label, value, className = "" }) => {
  return (
    <Space
      style={{ fontSize: "14px", lineHeight: "20px" }}
      className={joinClasses("w-full justify-between py-2", className)}
    >
      <Typography className="text-primary info-label">{label}</Typography>
      <Typography className="text-primary info-label font-semibold text-primary">
        {value}
      </Typography>
    </Space>
  );
};
