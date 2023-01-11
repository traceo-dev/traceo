import { joinClasses } from "core/utils/classes";
import { FC } from "react";

type AvatarShape = "circle" | "square";
type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  alt: string;
  src?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  className?: string;
}

const handleSize: Record<AvatarSize, string> = {
  sm: "w-6 h-6",
  md: "w-10 h-10",
  lg: "w-20 h-20"
};

const handleShape: Record<AvatarShape, string> = {
  circle: "rounded-full",
  square: "rounded"
};

export const Avatar: FC<AvatarProps> = ({
  alt,
  src,
  size = "md",
  shape = "circle",
  className
}) => {
  const initials = alt?.substring(0, 1).toUpperCase();

  const sizeStyle = handleSize[size];
  const shapeStyle = handleShape[shape];

  return (
    <img
      className={joinClasses(sizeStyle, shapeStyle, className)}
      alt={initials}
      src={src}
    />
  );
};
