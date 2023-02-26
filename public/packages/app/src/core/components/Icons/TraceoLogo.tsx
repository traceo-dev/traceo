import { joinClasses } from "../../utils/classes";
import { Space } from "@traceo/ui";
import { FC } from "react";

type Size = "small" | "medium";

interface Props {
  size: Size;
  name?: boolean;
  className?: string;
  onClick?: () => void;
}

export const TraceoLogo: FC<Props> = ({ size, onClick, name = false, className }) => {
  const mapLogoSize: Record<Size, string> = {
    medium: "w-12 h-12",
    small: "w-6 h-6"
  };

  const typographyLogoSize: Record<Size, string> = {
    medium: "text-5xl",
    small: "text-2xl"
  };

  const typographyNameSize: Record<Size, string> = {
    medium: "text-5xl",
    small: "text-sm"
  };

  return (
    <Space className={joinClasses(className)} onClick={() => onClick()}>
      <div
        className={joinClasses(
          mapLogoSize[size],
          "bg-yellow-500 flex justify-center items-center rounded-sm"
        )}
      >
        <span className={joinClasses(typographyLogoSize[size], "font-bold")}>T</span>
      </div>

      {name && (
        <span className={joinClasses(typographyNameSize[size], "font-semibold pl-2 text-primary")}>
          Traceo
        </span>
      )}
    </Space>
  );
};
