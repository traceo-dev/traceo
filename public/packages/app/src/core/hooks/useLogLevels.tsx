import { LogLevel } from "@traceo/types";
import { useState } from "react";
import { localStorageService } from "../lib/localStorage";
import { LocalStorage } from "../lib/localStorage/types";

export const useLogLevels = () => {
  const lsLevels = localStorageService
    .get<string>(LocalStorage.LogLevels)
    ?.split(",") as LogLevel[];

  const defaultLevels = [LogLevel.Log, LogLevel.Error, LogLevel.Warn] as LogLevel[];
  const [levels, setLevels] = useState<LogLevel[]>(lsLevels || defaultLevels);

  return { levels, setLevels };
};
