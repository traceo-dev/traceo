enum LogLevel {
    LOG = "log",
    WARN = "warn",
    ERROR = "error",
}

export class Logger {
    private constructor() {}

    public static log(msg: string) {
        this.writeMessage(LogLevel.LOG, msg)
    }

    public static error(msg: string) {
        this.writeMessage(LogLevel.ERROR, msg)
    };

    public static warn(msg: string) {
        this.writeMessage(LogLevel.WARN, msg)
    };

    private static colorizeMessage = (level: LogLevel, message: string): string => {
        const colors = {
            [LogLevel.WARN]: "\x1b[33m",
            [LogLevel.ERROR]: "\x1b[31m",
            default: "\x1b[0m",
        };
    
        const color = colors[level] || colors.default;
        return `${color}${message}\x1b[0m`;
    }
    
    private static get timestamp(): string {
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
    private static writeMessage = (level: LogLevel, message: string) => {
        const formattedMessage = `[${level.toUpperCase()}] - ${this.timestamp} - ${message}`;
    
        switch (level) {
            case LogLevel.WARN:
                console.log(this.colorizeMessage(level, formattedMessage));
                break;
            case LogLevel.ERROR:
                console.log(this.colorizeMessage(level, formattedMessage));
                break;
            default:
                console.log(formattedMessage);
        }
    }
}
