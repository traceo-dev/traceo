/* eslint-disable */

import { ClockCircleOutlined } from "@ant-design/icons";
import { Col, Row } from "@traceo/ui";
import ReactDOM from "react-dom";
import dateUtils from "../../../core/utils/date";
import uPlot from "uplot";
import styled from "styled-components";
import { useEffect, useState } from "react";

const TooltipContainer = styled.div`
  font-size: 12px;
  white-space: nowrap;
  position: absolute;
  max-width: min !important;
  background-color: var(--color-bg-canvas);
  border: 1px solid var(--color-bg-secondary);
  border-radius: 5px;
  padding: 9px;
  display: flex;
  flex-direction: column;
  z-index: 999;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
`;

interface Props {
  uPlot: uPlot;
}

// Padding over cursor for tooltip
const CURSOR_OFFSET = 15;

const TooltipContent = ({ uPlot }: Props) => {
  const { cursor = undefined, series = [], data = [], scales = [] } = uPlot;

  const [tWidth, setTWidth] = useState<number>(150);
  const [thHeight, setTHeight] = useState<number>(60);

  const [placementLeft, setPlacementLeft] = useState<number>(undefined);
  const [placementTop, setPlacementTop] = useState<number>(undefined);

  const { left, idx } = cursor;

  const xValue = uPlot.posToVal(left, "x");
  const isTimeScale = scales["x"].time;

  const cursorLeft = uPlot.cursor.left || 0;
  const cursorTop = uPlot.cursor.top || 0;

  const calculatePlacement = () => {
    const chartWidth = uPlot.width;
    const chartHeight = uPlot.height;
    const cursorXPosition = uPlot.bbox.left + cursorLeft;
    const cursorYPosition = uPlot.bbox.top + cursorTop;

    if (cursorXPosition + tWidth + 30 >= chartWidth) {
      setPlacementLeft(cursor.left - (tWidth + CURSOR_OFFSET));
    } else {
      setPlacementLeft(cursor.left + CURSOR_OFFSET);
    }

    if (cursorYPosition + thHeight + 30 >= chartHeight) {
      setPlacementTop(cursor.top - thHeight - CURSOR_OFFSET);
    } else {
      setPlacementTop(cursor.top + CURSOR_OFFSET);
    }
  };

  useEffect(() => {
    calculatePlacement();
  }, [cursorLeft, cursorTop]);

  // Avoid tooltip render after chart zooming
  if (!idx) {
    return null;
  }

  return (
    <TooltipContainer
      ref={(el) => {
        if (el) {
          setTHeight(el.offsetHeight);
          setTWidth(el.offsetWidth);
        }
      }}
      style={{
        left: `${placementLeft}px`,
        top: `${placementTop}px`
      }}
    >
      {isTimeScale ? (
        <Row gap="x-2">
          <ClockCircleOutlined />
          <span>{dateUtils.formatDate(xValue, "YYYY-MM-DD HH:mm:ss")}</span>
        </Row>
      ) : (
        <span>{xValue}</span>
      )}

      <Col className="gap-y-2 pt-2">
        {series.map((serie, index) => {
          if (index == 0) {
            return null;
          }

          if (serie.show && idx) {
            const value = data[index][idx] ?? [];
            const stroke = serie["_stroke"]?.toString();
            const fill = serie["_fill"]?.toString();
            const color = stroke ?? fill;

            return (
              <Row className="justify-between" key={index}>
                <Row gap="x-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  {serie.label && <span>{serie.label}</span>}
                </Row>

                <span className="pl-5 font-semibold">{value}</span>
              </Row>
            );
          }
        })}
      </Col>
    </TooltipContainer>
  );
};

export const tooltipsPlugin = () => {
  let tooltipCursor: HTMLDivElement = undefined;

  const init = (self: uPlot) => {
    const over = self.over;

    const div = document.createElement("div");
    tooltipCursor = div;
    over.appendChild(div);

    function hideTips() {
      tooltipCursor.style.display = "none";
    }

    function showTips() {
      tooltipCursor.style.display = null;
    }

    over.addEventListener("mouseleave", () => hideTips());
    over.addEventListener("mouseenter", () => showTips());

    // Hide tooltip when there is no cursor on graph
    self.cursor.left < 0 ? hideTips() : showTips();
  };

  const setCursor = (uPlot: uPlot) => {
    ReactDOM.render(<TooltipContent uPlot={uPlot} />, tooltipCursor);
  };

  return {
    hooks: {
      init,
      setCursor
    }
  };
};
