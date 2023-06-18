/* eslint-disable */

/* eslint @typescript-eslint/no-extra-semi: 0 */

import uPlot from "uplot";
import {
  BaseOptions,
  ChartConfigs,
  ChartType,
  HookType,
  TooltipOptions,
  UPlotAxis,
  UPlotLegend,
  UPlotSerie
} from "./types";
import { uPlotUtils } from "./utils";
import { tooltipsPlugin } from "./TooltipPlugin";
import { stackedOptions } from "./stacked";
import { PLOT_TYPE, UplotDataType } from "@traceo/types";

const defaultAxe: uPlot.Axis = {
  stroke: "#c7d0d9"
};

const mapTypeToPaths: Record<PLOT_TYPE, any> = {
  bar: uPlot.paths.bars,
  line: uPlot.paths.linear,
  points: uPlot.paths.points,
  spline: uPlot.paths.spline
};

export class UPlotConfigBuilder {
  private stacked = false;
  private isZoom = true;
  private chartType: ChartType = "timeseries";
  private data: UplotDataType = undefined;

  private configs: uPlot.Options;
  private base: uPlot.Options;
  private axes: uPlot.Axis[] = [];
  private series: uPlot.Series[] = [];
  private hooks: uPlot.Hooks.Arrays = {};
  private plugins: uPlot.Plugin[] = [];
  private select: uPlot.Select;
  private legend: uPlot.Legend;
  private cursor: uPlot.Cursor;
  private scales: uPlot.Scales;

  public addBase({
    id = undefined,
    height = 300,
    width = undefined,
    chartType = "timeseries",
    stacked = false,
    data = [[]],
    isZoom = true,
    ...rest
  }: BaseOptions): UPlotConfigBuilder {
    this.isZoom = isZoom;
    this.chartType = chartType;
    this.stacked = stacked;
    this.data = data;
    this.base = {
      id,
      width,
      height,
      mode: 1,
      series: this.series,
      ...rest
    };

    return this;
  }

  public addSerie({ type = PLOT_TYPE.LINE, bar, ...props }: UPlotSerie): UPlotConfigBuilder {
    const path = mapTypeToPaths[type];

    const barWidth = (bar?.width ?? 60) / 100;
    const barAlign = bar?.align ?? 0;

    let pathProps = {};
    switch (type) {
      case "bar":
        pathProps = {
          align: barAlign,
          size: [barWidth, 200]
        };
        break;
      default:
        break;
    }

    const options: uPlot.Series = {
      ...props,
      paths: path(pathProps)
    };

    this.series.push(options);
    return this;
  }

  public addTooltip({ show = !this.stacked }: TooltipOptions): UPlotConfigBuilder {
    if (show) {
      this.plugins.push(tooltipsPlugin());
    }
    return this;
  }

  // TODO: config.theme
  public addAxe({
    grid = {},
    ticks = {},
    isTimeAxis = false,
    space = undefined,
    values = undefined,
    formatter = undefined,
    showFloatLabels = true,
    ...props
  }: UPlotAxis): UPlotConfigBuilder {
    const axeConfig: uPlot.Axis = {
      ...props,
      stroke: "#c7d0d9",
      grid: Object.assign(
        {
          width: 1 / devicePixelRatio,
          stroke: "#2c3235"
        },
        grid
      ),
      ticks: Object.assign(
        {
          width: 1 / devicePixelRatio,
          stroke: "#2c3235"
        },
        ticks
      )
    };

    if (values) {
      axeConfig.values = values;
    } else if (isTimeAxis) {
      axeConfig.values = uPlotUtils.timeFormatter;
    } else if (formatter) {
      axeConfig.values = formatter;
    } else if (!showFloatLabels) {
      axeConfig.values = uPlotUtils.omitFloatLabels;
    }

    if (space) {
      axeConfig.space = space;
    } else if (isTimeAxis) {
      // support in case of zooming to miliseconds (overlapped labels)
      axeConfig.space = uPlotUtils.getTimeAxisSpace;
    }

    this.axes.push(axeConfig);

    return this;
  }

  public addSelect(option: uPlot.Select): UPlotConfigBuilder {
    this.select = option;
    return this;
  }

  public addCursor(option: uPlot.Cursor): UPlotConfigBuilder {
    this.cursor = option;
    this.cursor.drag.x = this.isZoom;

    return this;
  }

  public addHook(type: HookType, hook: any): UPlotConfigBuilder {
    const isHook = this.hooks[type];
    if (!isHook) {
      this.hooks[type] = [];
    }

    this.hooks[type].push(hook);
    return this;
  }

  public addPlugin(option: any): UPlotConfigBuilder {
    this.plugins.push(option);
    return this;
  }

  public addLegend({ show = false, ...props }: UPlotLegend): UPlotConfigBuilder {
    this.legend = {
      live: false,
      isolate: true,
      show,
      ...props
    };

    return this;
  }

  public addScale(option: uPlot.Scales): UPlotConfigBuilder {
    this.scales = option;
    return this;
  }

  public build(): ChartConfigs {
    if (!this.base) {
      this.addBase({});
    }

    if (!this.legend) {
      this.addLegend({});
    }

    if (!this.cursor) {
      this.addCursor({
        drag: {
          setScale: false,
          x: this.isZoom,
          y: false
        }
      });
    }

    if (!this.scales) {
      this.addScale({
        x: {
          time: true
        }
      });
    }

    if (this.axes.length === 0) {
      this.addAxe({ scale: "x", ...defaultAxe });
      this.addAxe({ scale: "y", ...defaultAxe });
    }

    if (this.chartType === "timeseries") {
      // y-serie for y-axis
      this.series = [{}, ...this.series];
    }

    // There should be at least 2 series for x and y axis
    if (this.series.length === 1) {
      this.addSerie({});
    }

    const configs = {
      ...this.base,
      series: this.series,
      axes: this.axes,
      hooks: this.hooks,
      plugins: this.plugins,
      scales: this.scales,
      select: this.select,
      cursor: this.cursor,
      legend: this.legend
    };

    if (this.stacked && this.data && this.data.length > 1) {
      const { data, options } = stackedOptions(configs, this.data);

      this.configs = options;
      this.data = data;
    } else {
      this.configs = configs;
    }

    return {
      data: this.data,
      options: this.configs
    };
  }
}
