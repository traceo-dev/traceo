import { Typography } from "core/ui-components/Typography";
import { FC } from "react";
import { joinClasses } from "../../core/utils/classes";

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
        weight="semibold"
        size="xs"
        className={joinClasses(typeStyle[type], "px-2 rounded-md")}
      >
        {children}
      </Typography>
    </>
  );
};
