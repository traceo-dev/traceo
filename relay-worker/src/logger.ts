/**
 * Simple logger to use in relay-worker only.
 */

enum LogLevel {
    LOG = "log",
    WARN = "warn",
    ERROR = "error",
}

const colorizeMessage = (level: LogLevel, message: string): string => {
    const colors = {
        [LogLevel.WARN]: "\x1b[33m",
        [LogLevel.ERROR]: "\x1b[31m",
        default: "\x1b[0m",
    };

    const color = colors[level] || colors.default;
    return `${color}${message}\x1b[0m`;
}

const getTimeStamp = (): string => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

/**
 * TODO: probably better is to use process.stdout instead of console.log 
 */
const writeMessage = (level: LogLevel, message: string) => {
    const formattedMessage = `[${level.toUpperCase()}] - ${getTimeStamp()} - ${message}`;

    switch (level) {
        case LogLevel.WARN:
            console.log(colorizeMessage(level, formattedMessage));
            break;
        case LogLevel.ERROR:
            console.log(colorizeMessage(level, formattedMessage));
            break;
        default:
            console.log(formattedMessage);
    }
}

const log = (msg: string) => writeMessage(LogLevel.LOG, msg);
const error = (msg: string) => writeMessage(LogLevel.ERROR, msg);
const warn = (msg: string) => writeMessage(LogLevel.WARN, msg);

export const Logger = {
    log,
    error,
    warn
}
