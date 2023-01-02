import { INCIDENT_PLOT_TYPE } from "types/metrics";
import { LogLevel } from "../../types/logs"

export const getLocalStorageLogLevels = () => {
    return localStorage.getItem("log_levels")?.split(",") as LogLevel[] || [LogLevel.Log, LogLevel.Error, LogLevel.Warn];
}

export const setLocalStorageLogLevels = (levels: LogLevel[] = []) => {
    localStorage.setItem("log_levels", levels.join(","))
}

export const getLocalStorageTimeLimit = () => {
    return localStorage.getItem("metric_time_limit") as unknown as number || 12;
}

export const setLocalStorageTimeLimit = (val: number) => {
    localStorage.setItem("metric_time_limit", val as unknown as string);
}

export const setLocalStorageIncidentPlotType = (type: string) => {
    localStorage.setItem("incidents_plot_type", type);
}

export const getLocalStorageIncidentPlotType = (): INCIDENT_PLOT_TYPE => {
    return (localStorage.getItem("incidents_plot_type") || "bar") as INCIDENT_PLOT_TYPE;
}