import { CONNECTION_STATUS } from "../enums/tsdb.enum";

export interface DataSourceConnStatus {
    status: CONNECTION_STATUS;
    error: string;
}
