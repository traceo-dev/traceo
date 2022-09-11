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
  shape = "circle",
  name,
  url,
  gap,
  size = "small",
  className
}) => {
  const initials = name?.substring(0, 1).toUpperCase();

  const handleInitialsColor: Record<string, string> = {
    A: "bg-red-800 text-white",
    B: "bg-red-900 text-white",
    C: "bg-orange-800 text-white",
    D: "bg-orange-900 text-white",
    E: "bg-indigo-800 text-white",
    F: "bg-indigo-900 text-white",
    G: "bg-yellow-800 text-white",
    H: "bg-yellow-900 text-white",
    I: "bg-lime-800 text-white",
    J: "bg-lime-900 text-white",
    K: "bg-green-900 text-white",
    L: "bg-green-900 text-white",
    M: "bg-emerald-800 text-white",
    N: "bg-emerald-900 text-white",
    O: "bg-cyan-800 text-white",
    P: "bg-cyan-900 text-white",
    Q: "bg-cyan-800 text-white",
    R: "bg-cyan-900 text-white",
    S: "bg-sky-800 text-white",
    T: "bg-sky-900 text-white",
    U: "bg-blue-800 text-white",
    V: "bg-blue-900 text-white",
    W: "bg-indigo-800 text-white",
    X: "bg-indigo-900 text-white",
    Y: "bg-violet-800 text-white",
    Z: "bg-violet-900 text-white"
  };

  return (
    <>
      <AntAvatar
        className={joinClasses(handleInitialsColor[initials], className, "capitalize")}
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
