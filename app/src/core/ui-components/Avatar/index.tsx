import { joinClasses } from "../../../core/utils/classes";
import { forwardRef, HTMLProps } from "react";

type AvatarShape = "circle" | "square";
type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps extends Omit<HTMLProps<HTMLImageElement>, "src" | "size"> {
  alt: string;
  src?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  className?: string;
}

const mapSize: Record<AvatarSize, string> = {
  sm: "w-5 h-5",
  md: "w-10 h-10",
  lg: "w-20 h-20"
};

const mapShape: Record<AvatarShape, string> = {
  circle: "rounded-full",
  square: "rounded"
};

export const Avatar = forwardRef<HTMLImageElement, AvatarProps>((props, _ref) => {
  const { alt, src, size = "md", shape = "circle", className } = props;
  const initials = alt?.substring(0, 1).toUpperCase();

  const sizeStyle = mapSize[size];
  const shapeStyle = mapShape[shape];

  return (
    <img
      className={joinClasses(sizeStyle, shapeStyle, className)}
      alt={initials}
      src={src}
    />
  );
});

Avatar.displayName = "Avatar";
