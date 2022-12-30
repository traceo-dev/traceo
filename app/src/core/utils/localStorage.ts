import { LogLevel } from "../../types/logs"

export const getLocalStorageLogLevels = () => {
    return localStorage.getItem("logLevels")?.split(",") as LogLevel[] || [LogLevel.Log, LogLevel.Error, LogLevel.Warn];
}

export const setLocalStorageLogLevels = (levels: LogLevel[] = []) => {
    localStorage.setItem("logLevels", levels.join(","))
}

export const getLocalStorageMetricHrCount = () => {
    return localStorage.getItem("hrCount") as unknown as number || 12;
}

export const setLocalStorageMetricHrCount = (val: number) => {
    localStorage.setItem("hrCount", val as unknown as string);
}