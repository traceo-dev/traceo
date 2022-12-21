import { LogLevel } from "../../types/logs"

export const getLocalStorageLogLevels = () => {
    return localStorage.getItem("logLevels")?.split(",") as LogLevel[] || [LogLevel.Log, LogLevel.Error, LogLevel.Warn];
}

export const setLocalStorageLogLevels = (levels: LogLevel[] = []) => {
    localStorage.setItem("logLevels", levels.join(","))
}