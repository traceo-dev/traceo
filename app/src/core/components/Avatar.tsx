import { Avatar as AntAvatar } from "antd";
import { FC } from "react";
import { joinClasses } from "src/core/utils/classes";

interface Props {
  name: string;
  url?: string;
  shape?: "square" | "circle";
  gap?: number;
  size?: "default" | "large" | "small";
  className?: string;
}

export const Avatar: FC<Props> = ({
  shape = "square",
  name,
  url,
  gap,
  size,
  className
}) => {
  const initials = name?.substring(0, 1);

  const handleInitialsColor: Record<string, string> = {
    A: "bg-red-600 text-white",
    B: "bg-red-700 text-white",
    C: "bg-orange-600 text-white",
    D: "bg-orange-700 text-white",
    E: "bg-indigo-600 text-white",
    F: "bg-indigo-700 text-white",
    G: "bg-yellow-600 text-white",
    H: "bg-yellow-700 text-white",
    I: "bg-lime-600 text-white",
    J: "bg-lime-700 text-white",
    K: "bg-green-700 text-white",
    L: "bg-green-700 text-white",
    M: "bg-emerald-600 text-white",
    N: "bg-emerald-700 text-white",
    O: "bg-cyan-600 text-white",
    P: "bg-cyan-700 text-white",
    Q: "bg-cyan-600 text-white",
    R: "bg-cyan-700 text-white",
    S: "bg-sky-600 text-white",
    T: "bg-sky-700 text-white",
    U: "bg-blue-600 text-white",
    V: "bg-blue-700 text-white",
    W: "bg-indigo-600 text-white",
    X: "bg-indigo-700 text-white",
    Y: "bg-violet-600 text-white",
    Z: "bg-violet-700 text-white"
  };

  return (
    <>
      <AntAvatar
        className={joinClasses(handleInitialsColor[initials], className)}
        size={size}
        gap={gap}
        shape={shape}
        src={url}
      >
        {initials}
      </AntAvatar>
    </>
  );
};
