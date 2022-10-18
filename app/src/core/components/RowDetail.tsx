import { Space, Typography } from "antd";
import { joinClasses } from "../../core/utils/classes";

export const RowDetail = ({ label, value, className = "" }) => {
  return (
    <Space className={joinClasses("w-full justify-between py-2 gap-0", className)}>
      <Typography className="text-primary info-label">{label}</Typography>
      <Typography className="text-primary info-label font-semibold text-primary">
        {value}
      </Typography>
    </Space>
  );
};
