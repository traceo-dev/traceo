import { Injectable } from "@nestjs/common";
import { BaseQueryService } from "../../../common/base/query/base-query.service";
import { AlertQueryDto } from "../../../common/types/dto/alert.dto";
import { Alert } from "../../../db/entities/alert.entity";
import { Brackets, EntityManager, SelectQueryBuilder } from "typeorm";
import { AlertEnumType, AlertStatus } from "@traceo/types";

@Injectable()
export class AlertQueryService extends BaseQueryService<Alert, AlertQueryDto> {
  constructor(readonly entityManager: EntityManager) {
    super(entityManager, Alert);
  }

  override async getDto(id: string): Promise<Alert> {
    return await this.getTransactionalDto(id);
  }

  /**
   * Method to use in transactional operations. Pass manager parameter as your transaction instance.
   */
  public async getTransactionalDto(id: string, manager: EntityManager = this.entityManager) {
    return await manager
      .getRepository(Alert)
      .createQueryBuilder("alert")
      .where("alert.id = :id", { id })
      .leftJoinAndSelect("alert.rules", "rules")
      .leftJoinAndSelect("alert.recipients", "recipients")
      .leftJoinAndSelect("recipients.user", "user")
      .getOne();
  }

  public async getActiveIncidentAlerts() {
    return await this.entityManager
      .getRepository(Alert)
      .createQueryBuilder("alert")
      .where("alert.status = :status", { status: AlertStatus.ACTIVE })
      .andWhere("alert.type = :type", { type: AlertEnumType.INCIDENT })
      .leftJoinAndSelect("alert.rules", "rules")
      .leftJoinAndSelect("alert.recipients", "recipients")
      .leftJoinAndSelect("alert.project", "project")
      .getMany();
  }

  public extendQueryBuilder(
    builder: SelectQueryBuilder<Alert>,
    query: AlertQueryDto
  ): SelectQueryBuilder<Alert> {
    builder
      .where("alert.project_id = :projectId", { projectId: query.projectId })
      .leftJoinAndSelect("alert.rules", "rules");

    const status = query?.status;
    if (status) {
      builder.andWhere("alert.status = :status", { status });
    }

    const search = query?.search;
    if (search) {
      builder.andWhere(
        new Brackets((qb) => {
          qb.where("LOWER(alert.name) LIKE LOWER(:search)", {
            search: `%${search}%`
          })
            .orWhere("LOWER(alert.description) LIKE LOWER(:search)", {
              search: `%${search}%`
            })
            .orWhere("LOWER(alert.type) LIKE LOWER(:search)", {
              search: `%${search}%`
            })
            .orWhere("LOWER(alert.severity) LIKE LOWER(:search)", {
              search: `%${search}%`
            });
        })
      );
    }

    return builder;
  }

  public get builderAlias(): string {
    return "alert";
  }

  public selectedColumns(): string[] {
    return [];
  }
}
