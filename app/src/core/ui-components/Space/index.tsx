import { conditionClass, joinClasses } from "core/utils/classes";
import { FC, HTMLProps } from "react";

type SpaceDirectionType = "horizontal" | "vertical";

interface SpaceProps extends HTMLProps<HTMLDivElement> {
  direction?: SpaceDirectionType;
}
export const Space: FC<SpaceProps> = ({
  direction = "horizontal",
  children,
  className,
  ...restProps
}) => {
  return (
    <div
      {...restProps}
      className={joinClasses(
        "inline-flex gap-1",
        conditionClass(direction === "horizontal", "flex-row items-center", "flex-col"),
        className
      )}
    >
      {children}
    </div>
  );
};

Space.displayName = "Space";
