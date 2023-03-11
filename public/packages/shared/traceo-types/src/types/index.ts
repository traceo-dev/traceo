export * from "./user";
export * from "./member";
export * from "./api";
export * from "./application";
export * from "./auth";
export * from "./comment";
export * from "./configs";
export * from "./datasource";
export * from "./incident";
export * from "./influxds";
export * from "./log";
export * from "./metrics";
export * from "./notifications";
export * from "./runtime";
export * from "./session";
export * from "./statistics";
export * from "./tsdb";
export * from "./webSocket";
export * from "./browser";
export * from "./sdk";

export type DeepPartial<T> = T extends object
    ? {
        [P in keyof T]?: DeepPartial<T[P]>;
    }
    : T;

export type Dictionary<T> = {
    [key: string]: T;
};

