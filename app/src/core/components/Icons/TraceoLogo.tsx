import { Space } from "antd";
import { FC } from "react";
import { conditionClass, joinClasses } from "src/core/utils/classes";

type Size = "small" | "medium";

interface Props {
  size: Size;
  withName?: boolean;
  onClick?: () => void;
}

export const TraceoLogo: FC<Props> = ({ size, withName = false, onClick }) => {
  const handleLogoSize: Record<Size, string> = {
    medium: "w-12 h-12",
    small: "w-6 h-6"
  };

  const typographyLogoSize: Record<Size, string> = {
    medium: "text-5xl",
    small: "text-2xl"
  };

  const typographyNameSize: Record<Size, string> = {
    medium: "text-md",
    small: "text-sm"
  };

  return (
    <Space
      onClick={() => onClick()}
      className={conditionClass(!!onClick, "cursor-pointer")}
    >
      <div
        className={joinClasses(
          handleLogoSize[size],
          "bg-yellow-500 flex justify-center items-center rounded-sm"
        )}
      >
        <span className={joinClasses(typographyLogoSize[size], "font-bold")}>T</span>
      </div>

      {withName && (
        <span className={joinClasses(typographyNameSize[size], "font-semibold")}>
          Traceo
        </span>
      )}
    </Space>
  );
};
