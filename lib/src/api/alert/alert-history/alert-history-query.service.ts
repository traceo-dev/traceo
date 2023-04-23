import { Injectable } from "@nestjs/common";
import { BaseQueryService } from "src/common/base/query/base-query.service";
import { AlertHistoryQueryDto } from "src/common/types/dto/alert.dto";
import { AlertHistory } from "src/db/entities/alert-history.entity";
import { EntityManager, SelectQueryBuilder } from "typeorm";

@Injectable()
export class AlertHistoryQueryService extends BaseQueryService<AlertHistory, AlertHistoryQueryDto> {
    constructor(readonly entityManager: EntityManager) {
        super(entityManager, AlertHistory);
    }

    public extendQueryBuilder(builder: SelectQueryBuilder<AlertHistory>, query: AlertHistoryQueryDto): SelectQueryBuilder<AlertHistory> {
        builder.leftJoinAndSelect("alert-history.alert", "alert", "alert.id = :id", { id: query.alertId });

        return builder;
    }

    public get builderAlias(): string {
        return "alert-history";
    }

    public selectedColumns(): string[] {
        return [];
    }
}