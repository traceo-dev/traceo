import { conditionClass, joinClasses } from "../utils/classes";
import { FC, PropsWithChildren } from "react";

// type DirectionType = "vertical" | "horizontal";

interface ButtonContainerProps {
  className?: string;
  hidden?: boolean;
  justify?: "start" | "center" | "end";
}

export const ButtonContainer: FC<PropsWithChildren<ButtonContainerProps>> = ({
  className,
  hidden = false,
  justify = "end",
  children,
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
