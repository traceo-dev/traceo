import { Setter, Span } from "@traceo/types";
import { Row } from "@traceo/ui";
import { useRef } from "react";
import { parseDuration } from "../utils";

interface Props {
  root: Span;
  leftWidth: string;
  setLeftWidth: Setter<string>;
  rightWidth: string;
  setRightWidth: Setter<string>;
}

const MAX_LEFT_WIDTH = "25%";
const MAX_RIGHT_WIDTH = "75%";

export const TimelineHeader = ({
  root = undefined,
  leftWidth = MAX_LEFT_WIDTH,
  setLeftWidth = undefined,
  rightWidth = MAX_RIGHT_WIDTH,
  setRightWidth = undefined
}: Props) => {
  const draggableRef = useRef(null);

  const handleDragStart = () => {
    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
  };

  const handleDragMove = (e: MouseEvent) => {
    const draggableRect = draggableRef.current.getBoundingClientRect();
    const containerRect = draggableRef.current.parentNode.getBoundingClientRect();
    const totalWidth = containerRect.width;
    const mouseX = e.clientX;

    let newLeftDivWidth = `${
      ((mouseX - containerRect.left - draggableRect.width / 2) / totalWidth) * 100
    }%`;
    let newRightDivWidth = `${100 - parseFloat(newLeftDivWidth)}%`;

    // Restrict minimum width to 10%
    if (parseFloat(newLeftDivWidth) < 10) {
      newLeftDivWidth = "10%";
      newRightDivWidth = "90%";
    } else if (parseFloat(newRightDivWidth) < 10) {
      newLeftDivWidth = "90%";
      newRightDivWidth = "10%";
    }

    setLeftWidth(newLeftDivWidth);
    setRightWidth(newRightDivWidth);
  };

  const handleDragEnd = () => {
    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mouseup", handleDragEnd);
  };

  return (
    <div className="flex leading-9 border-bottom relative">
      <Row
        style={{ width: leftWidth }}
        className="py-2 whitespace-nowrap text-sm font-normal select-none"
      >
        Service & Operation
      </Row>
      <div className="draggable-timeline" ref={draggableRef} onMouseDown={handleDragStart} />
      <Row
        style={{ width: rightWidth }}
        className="z-90 px-1 bg-primary border-left justify-between text-[12px] select-none overflow-x-hidden"
      >
        <span>0ms</span>
        <span>{parseDuration(root.duration * 0.25)}</span>
        <span>{parseDuration(root.duration * 0.5)}</span>
        <span>{parseDuration(root.duration * 0.75)}</span>
        <span>{parseDuration(root.duration)}</span>
      </Row>
    </div>
  );
};
