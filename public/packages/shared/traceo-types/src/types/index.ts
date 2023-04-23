export * from "./alert";
export * from "./user";
export * from "./member";
export * from "./api";
export * from "./project";
export * from "./auth";
export * from "./comment";
export * from "./configs";
export * from "./incident";
export * from "./log";
export * from "./metrics";
export * from "./notifications";
export * from "./runtime";
export * from "./session";
export * from "./statistics";
export * from "./webSocket";
export * from "./browser";
export * from "./sdk";
export * from "./kafka";
export * from "./event";
export * from "./performance";

export type SafeReturnType = string | number;

export type DeepPartial<T> = T extends object
    ? {
        [P in keyof T]?: DeepPartial<T[P]>;
    }
    : T;

export type Dictionary<T> = {
    [key: string]: T;
};

export type Setter<S> = (arg: S) => void;

export type TriggerType = () => void;