import { conditionClass, joinClasses } from "core/utils/classes";
import { FC } from "react";

type DirectionType = "vertical" | "horizontal";

interface ButtonContainerProps {
  className?: string;
  hidden?: boolean;
  justify?: "start" | "center" | "end";
}

export const ButtonContainer: FC<ButtonContainerProps> = ({
  children,
  className,
  hidden = false,
  justify = "end"
}) => {
  return (
    <div
      className={joinClasses(
        `w-full flex flex-row gap-2 mt-5 justify-${justify}`,
        conditionClass(hidden, "display-none"),
        className
      )}
    >
      {children}
    </div>
  );
};
