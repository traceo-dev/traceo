import { Injectable } from "@nestjs/common";
import dateUtils from "../../common/helpers/dateUtils";
import { gravatar } from "../../common/helpers/gravatar";
import { uuidService } from "../../common/helpers/uuid";
import { CreateProjectDto } from "../../common/types/dto/project.dto";
import { Project } from "../../db/entities/project.entity";
import { User } from "../../db/entities/user.entity";
import { EntityManager } from "typeorm";
import { MemberService } from "../member/member.service";
import { UserQueryService } from "../user/user-query/user-query.service";
import { ADMIN_EMAIL, ADMIN_NAME } from "../../common/helpers/constants";
import { MemberRole } from "@traceo/types";
import { RequestContext } from "../../common/middlewares/request-context/request-context.model";
import { DashboardService } from "../dashboard/dashboard.service";

@Injectable()
export class ProjectFactory {

    constructor(
        private readonly manager: EntityManager,
        private readonly memberService: MemberService,
        private readonly userQueryService: UserQueryService,
        private readonly dashboardService: DashboardService
    ) { }

    public async create(user: User, dto: CreateProjectDto, manager = this.manager) {
        const { username } = RequestContext.user
        const unix = dateUtils.toUnix();

        const payload: Partial<Project> = {
            ...dto,
            id: this.uuid,
            createdAt: unix,
            updatedAt: unix,
            owner: user,
            gravatar: this.gravatar(dto.name)
        };

        const project = await this.manager.getRepository(Project).save(payload);
        if (!project) {
            return null;
        }

        if (username !== ADMIN_NAME) {
            const admin = await this.userQueryService.getDtoBy({ email: ADMIN_EMAIL });
            await this.createMember(admin, project, manager);
        }

        await this.createMember(user, project, manager);

        const dashboard = await this.createDashboard(project, manager);
        if (!dashboard) {
            return null;
        }

        project.mainDashboardId = dashboard.id;

        await manager.getRepository(Project).update({ id: project.id }, {
            updatedAt: dateUtils.toUnix(),
            mainDashboardId: dashboard.id
        });

        return project;
    }

    private async createDashboard(project: Project, manager = this.manager) {
        return await this.dashboardService.create({
            name: "Base Dashboard",
            description: undefined,
            isEditable: false,
            isTimePicker: false,
            isBase: true
        },
            project,
            manager
        );
    }

    private async createMember(user: User, project: Project, manager = this.manager) {
        await this.memberService.createMember(user, project, MemberRole.ADMINISTRATOR, manager);
    }

    private get uuid() {
        return uuidService.generate();
    }

    private gravatar(name: string) {
        return gravatar.url(name, "identicon");
    }
}