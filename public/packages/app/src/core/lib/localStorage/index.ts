import { INCIDENT_PLOT_TYPE, LogLevel } from "@traceo/types";
import { type } from "os";

// export const getLocalStorageLogLevels = () => {
//     return localStorage.getItem("traceo.selected.log.levels")?.split(",") as LogLevel[] || [LogLevel.Log, LogLevel.Error, LogLevel.Warn];
// }

// export const setLocalStorageLogLevels = (levels: LogLevel[] = []) => {
//     localStorage.setItem("traceo.selected.log.levels", levels.join(","))
// }

// export const getLocalStorageTimeLimit = () => {
//     return localStorage.getItem("metric_time_limit") as unknown as number || 12;
// }

// export const setLocalStorageTimeLimit = (val: number) => {
//     localStorage.setItem("metric_time_limit", val as unknown as string);
// }

// export const setLocalStorageIncidentPlotType = (type: string) => {
//     localStorage.setItem("traceo.incidents.plot.type", type);
// }

// export const getLocalStorageIncidentPlotType = (): INCIDENT_PLOT_TYPE => {
//     return (localStorage.getItem("traceo.incidents.plot.type") || "bar") as INCIDENT_PLOT_TYPE;
// }

const get = <T>(name: string): T => {
    const item = localStorage.getItem(name);
    if (item === null || typeof item !== "object") {
        return item as T;
    }

    return JSON.parse(item);
}

const set = (name: string, value: any) => {
    if (typeof value === "object") {
        localStorage.setItem(name, JSON.stringify(value));
    } else {
        localStorage.setItem(name, value);
    }
}

export const localStorageService = {
    get,
    set
}