import { Injectable, Logger, OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
import * as schedule from "node-schedule";
import { Alert } from "src/db/entities/alert.entity";
import { AlertQueryService } from "../alert-query/alert-query.service";
import { Cron } from "@nestjs/schedule";
import { AlertIncidentService } from "./alert-incident.service";

@Injectable()
export class AlertEngineService implements OnModuleInit, OnApplicationShutdown {
    private readonly logger: Logger;
    private readonly jobs = new Map<string, schedule.Job>();

    constructor(
        private readonly alertQueryService: AlertQueryService,
        private readonly evaluateIncidentService: AlertIncidentService
    ) {
        this.logger = new Logger(AlertEngineService.name)
    }

    public async onApplicationShutdown() {
        await schedule.gracefulShutdown();
    }

    public onModuleInit() {
        console.log("============= alert engine init ============");
    }

    public createJob(alert: Alert): void {
        // const job = schedule.scheduleJob("* * * * * *", () => { });
        // this.jobs.set(alert.id, job);
    }

    public removeJob(id: string): void {
        try {
            const job = this.jobs.get(id);
            if (!job) {
                throw new Error(`There is no job for alert ${id}`);
            }

            schedule.cancelJob(job);
            this.jobs.delete(id);

            this.logger.log(`Alert job ${id} has been shutdown.`);
        } catch (err) {
            this.logger.error(err);
        }
    }

    @Cron("5 * * * * *")
    private async evalIncidentsAlerts() {
        this.logger.log(`[${this.evalIncidentsAlerts.name}] Checking incidents alerts...`);

        try {
            const activeAlerts: Alert[] = await this.alertQueryService.getActiveIncidentAlerts();
            this.logger.log(`[${this.evalIncidentsAlerts.name}] Found ${activeAlerts.length} active alerts.`);

            await this.evaluateIncidentService.run(activeAlerts);

            this.logger.log(`[${this.evalIncidentsAlerts.name}] Incident alerts check completed.`);
        } catch (err) {
            this.logger.error(`[${this.evalIncidentsAlerts.name}] Caused by: ${err}`);
        }
    }
}