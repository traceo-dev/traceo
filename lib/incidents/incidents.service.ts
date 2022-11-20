import { Injectable, Logger } from "@nestjs/common";
import { Incident } from "../db/entities/incident.entity";
import { EntityManager } from "typeorm";
import { AccountQueryService } from "../../lib/account/account-query/account-query.service";
import { IncidentBatchUpdateDto, IncidentUpdateDto } from "../../lib/types/dto/incident.dto";
import { ApiResponse } from "../../lib/types/dto/response.dto";
import { INTERNAL_SERVER_ERROR } from "../../lib/helpers/constants";

@Injectable()
export class IncidentsService {
  private logger: Logger;
  constructor(
    private entityManger: EntityManager,
    private accountQueryService: AccountQueryService
  ) {
    this.logger = new Logger(IncidentsService.name);
  }

  async updateIncident(
    incidentId: string,
    update: IncidentUpdateDto,
  ): Promise<ApiResponse<unknown>> {
    if (!update) {
      return;
    }

    return await this.entityManger.transaction(async (manager) => {
      if (update.assignedId) {
        const account = await this.accountQueryService.getDto(update.assignedId);
        await manager
          .getRepository(Incident)
          .update({ id: incidentId }, { assigned: account });

        return new ApiResponse("success", "Incident assigned.");
      }

      await manager.getRepository(Incident).update({ id: incidentId }, update);

      return new ApiResponse("success", "Incident updated.");
    }).catch((err: Error) => {
      this.logger.error(`[${this.updateIncident.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    });
  }

  async updateBatchIncidents(update: IncidentBatchUpdateDto): Promise<ApiResponse<unknown>> {
    const { incidentsIds, ...rest } = update;

    if (!update) {
      return;
    }

    try {
      await this.entityManger
        .getRepository(Incident)
        .createQueryBuilder()
        .whereInIds(incidentsIds)
        .update(rest)
        .execute();

      return new ApiResponse("success", "Incidents updated.");
    } catch (err) {
      this.logger.error(`[${this.updateBatchIncidents.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  async removeIncident(id: string): Promise<ApiResponse<unknown>> {
    try {
      await this.entityManger
        .getRepository(Incident)
        .createQueryBuilder("incident")
        .where("incident.id = :id", { id })
        .delete()
        .execute();

      return new ApiResponse("success", "Incident removed.");
    } catch (err) {
      this.logger.error(`[${this.removeIncident.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }
}
