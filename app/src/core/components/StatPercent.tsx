import { Typography } from "antd";
import { FC } from "react";
import { joinClasses } from "src/core/utils/classes";

type StatType = "success" | "warning";
interface Props {
  type: StatType;
}
export const StatPercent: FC<Props> = ({ type, children }) => {
  const typeStyle: Record<string, string> = {
    success: "text-green-700 bg-green-200 ",
    warning: "text-red-700 bg-red-200"
  };
  return (
    <>
      <Typography
        className={joinClasses(typeStyle[type], "font-semibold px-2 rounded-md text-xs")}
      >
        {children}
      </Typography>
    </>
  );
};
