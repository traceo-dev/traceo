import uPlot from "uplot";

//https://github.com/leeoniya/uPlot/tree/master/demos

const { linear, stepped, bars, spline } = uPlot.paths;

export const normalizePlotData = (plotData: { date: number; count: number }[]) => {
  const x: number[] = [];
  const y: number[] = [];

  plotData?.map((d) => {
    x.push(d.date);
    y.push(d.count);
  });

  return {
    x,
    y
  };
};

export const gradientFill = (u: uPlot, stops: [number, string][]) => {
  const can = document.createElement("canvas");
  const ctx = can.getContext("2d");
  const grd = ctx.createLinearGradient(0, u.bbox.top, 0, u.bbox.top + u.bbox.height);

  stops.forEach((s) => {
    grd.addColorStop(s[0], s[1]);
  });

  return grd;
};

export enum LineInterpolation {
  LINEAR = 0,
  STEP_AFTER = 1,
  STEP_BEFORE = 2,
  SPLINE = 3
}

export enum DrawStyle {
  LINE = 0,
  BARS = 1,
  POINTS = 2,
  BARS_LEFT = 3,
  BARS_RIGHT = 4
}

export const paths = (u, seriesIdx, idx0, idx1) => {
  const s = u.series[seriesIdx];
  const style = s.drawStyle;
  const interp = s.lineInterpolation;

  const _bars60_100 = bars({ size: [0.6, 100] });
  const _bars100Left = bars({ size: [0.5, 10], align: 1 });
  const _bars100Right = bars({ size: [0.5, 100], align: -1 });
  const _stepBefore = stepped({ align: -1 });
  const _stepAfter = stepped({ align: 1 });
  const _linear = linear();
  const _spline = spline();

  const renderer =
    style == DrawStyle.LINE
      ? interp == LineInterpolation.LINEAR
        ? _linear
        : interp == LineInterpolation.STEP_AFTER
        ? _stepAfter
        : interp == LineInterpolation.STEP_BEFORE
        ? _stepBefore
        : interp == LineInterpolation.SPLINE
        ? _spline
        : null
      : style == DrawStyle.BARS
      ? _bars60_100
      : style == DrawStyle.BARS_LEFT
      ? _bars100Left
      : style == DrawStyle.BARS_RIGHT
      ? _bars100Right
      : style == DrawStyle.POINTS
      ? () => null
      : () => null;

  return renderer(u, seriesIdx, idx0, idx1);
};
