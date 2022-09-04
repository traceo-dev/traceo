/* eslint-disable */

import dateUtils from "src/core/utils/date";
import { TooltipConfig } from "src/types/plot";

export const tooltipsPlugin = (config: TooltipConfig) => {
  const init = (u: any, opts: uPlot.Options) => {
    if (config?.hidden) {
      return;
    }

    let over = u.over;

    let ttc = (u.cursortt = document.createElement("div"));
    over.appendChild(ttc);

    u.seriestt = opts.series.map((s, i) => {
      if (i == 0) return;

      let tt = document.createElement("div");
      tt.className = "plot-tooltip";
      tt.style.display = s.show ? null : "none";
      over.appendChild(tt);
      return tt;
    });

    const hideTips = () => {
      ttc.style.display = "none";
      u.seriestt?.forEach((tt, i) => {
        if (i == 0) return;

        tt.style.display = "none";
      });
    };

    const showTips = () => {
      ttc.style.display = null;
      u.seriestt?.forEach((tt, i) => {
        if (i == 0) return;

        let s = u.series[i];
        tt.style.display = s.show ? null : "none";
      });
    };

    over.addEventListener("mouseleave", () => {
      if (!u.cursor._lock) {
        hideTips();
      }
    });

    over.addEventListener("mouseenter", () => {
      showTips();
    });

    hideTips();
  };

  const tooltipContent = (config: TooltipConfig, xVal: any, yVal: any) => {
    const { xLabel, yLabel, dateFormat } = config;
    if (xLabel && yLabel) {
      return `${xLabel}: ${dateUtils.formatDate(
        xVal,
        dateFormat
      )}, ${yLabel}: ${yVal?.toFixed(0)}`;
    }

    return `y: ${yVal}, x: ${xVal}`;
  };

  const setCursor = (u) => {
    const { left, top, idx } = u.cursor;

    u.seriestt?.forEach((tt, i) => {
      if (i == 0) return;

      let s = u.series[i];

      if (s.show) {
        const xVal = u.data[0][idx];
        const yVal = u.data[i][idx];

        const content = tooltipContent(config, xVal, yVal);
        tt.textContent = content;

        tt.style.left = left + "px";
        tt.style.top = top + "px";
      }
    });
  };

  return {
    hooks: {
      init,
      setCursor
    }
  };
};
