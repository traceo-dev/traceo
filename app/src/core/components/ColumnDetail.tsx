import { Space } from "antd";
import { Typography } from "core/ui-components/Typography/Typography";
import { joinClasses } from "../../core/utils/classes";

export const ColumnDetail = ({ label, value, className = "" }) => {
  return (
    <Space
      direction="vertical"
      className={joinClasses("w-full pb-4 gap-0 pr-3", className)}
    >
      <Typography className="info-label">{label}</Typography>
      {typeof value === "string" || typeof value === "number" ? (
        <Typography weight="semibold" className="text-link">
          {value}
        </Typography>
      ) : (
        value
      )}
    </Space>
  );
};
