import dateUtils from "../../../../../core/utils/date";
import { EChartsOption, SeriesOption } from "echarts";
import { LogLevel } from "../../../../../types/logs";
import { tooltipOptions } from "../../utils";

export const mapLogName: Record<LogLevel, string> = {
    [LogLevel.Log]: "Log",
    [LogLevel.Debug]: "Debug",
    [LogLevel.Info]: "Info",
    [LogLevel.Error]: "Error",
    [LogLevel.Warn]: "Warning"
};

export const mapLogColor: Record<LogLevel, string> = {
    [LogLevel.Log]: "#2b6cb0",
    [LogLevel.Debug]: "#f6993f",
    [LogLevel.Info]: "#176537",
    [LogLevel.Error]: "#e53e3e",
    [LogLevel.Warn]: "#F7DF4B"
};

export const commonSeriesOptions = {
    type: "bar",
    stack: "Ad",
    barWidth: 15,
    itemStyle: {
        borderColor: "transparent",
        borderWidth: 2,
        borderRadius: 2
    }
};

export const getLogExploreOptions = (xAxis: number[], series: SeriesOption[]): EChartsOption => {
    return {
        animation: false,
        tooltip: {
            ...tooltipOptions,
            axisPointer: {
                type: "shadow"
            }
        },
        grid: {
            left: "15px",
            right: "15px",
            top: "10px",
            bottom: "15px",
            containLabel: true
        },
        xAxis: {
            data: xAxis,
            type: "category",
            axisLabel: {
                formatter: (v) => dateUtils.formatDate(Number(v), "HH:mm"),
                color: "white",
                fontSize: 11,
                padding: 0,
                interval: 5
            },
            axisPointer: {
                label: {
                    formatter: (v) => dateUtils.formatDate(v.value as number, "MMM D, HH:mm")
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: "#272A30",
                    width: 1
                }
            },
            offset: 15
        },
        yAxis: {
            type: "value",
            axisLabel: {
                color: "white",
                fontSize: 11
            },
            splitLine: {
                lineStyle: {
                    color: "#272A30",
                    width: 1
                }
            },
            minInterval: 10,
            offset: 12
        },
        series
    }

};