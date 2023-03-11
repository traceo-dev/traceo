import { Application } from "src/db/entities/application.entity";

export interface IProcessor<T> {
    process(app: Application, data: T): Promise<void>;
}