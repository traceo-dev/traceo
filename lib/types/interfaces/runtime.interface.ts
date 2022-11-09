import { IApplication } from "./application.interface";

export interface IRuntime {
    id?: string;
    data: object;
    application: IApplication;
}