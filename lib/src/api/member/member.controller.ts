import {
  Body,
  Controller,
  Delete,
  Get,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../../common/decorators/auth-guard.decorator";
import { BaseDtoQuery } from "../../common/base/query/base-query.model";
import { CreateMemberDto, UpdateMemberDto } from "../../common/types/dto/member.dto";
import { ProjectDtoQuery } from "../../common/types/dto/project.dto";
import { ApiResponse } from "../../common/types/dto/response.dto";
import { IMember, IProjectResponse } from "@traceo/types";
import { MemberQueryService } from "./member-query/member-query.service";
import { MemberService } from "./member.service";

@ApiTags("member")
@Controller("member")
@UseGuards(new AuthGuard())
export class MemberController {
  constructor(
    private readonly amrService: MemberService,
    private readonly amrQueryService: MemberQueryService
  ) {}

  @Get("/permission")
  async getPermission(@Query("id") id: string): Promise<ApiResponse<IProjectResponse>> {
    return await this.amrQueryService.getPermission(id);
  }

  @Get("/search")
  public async getMembers(
    @Query("id") id: string,
    @Query() query: BaseDtoQuery
  ): Promise<ApiResponse<IMember[]>> {
    return await this.amrQueryService.getMembers(id, query);
  }

  @Get("/projects")
  public async getUserProjects(
    @Query() pageOptionsDto: ProjectDtoQuery,
    @Query("userId") userId: string
  ): Promise<ApiResponse<IMember[]>> {
    return await this.amrQueryService.getUserProjects(userId, pageOptionsDto);
  }

  @Post("/project/add")
  public async addUserToProject(@Body() body: CreateMemberDto): Promise<ApiResponse<unknown>> {
    return await this.amrService.addUserToProject(body);
  }

  @Patch()
  public async updateMember(@Body() body: UpdateMemberDto): Promise<ApiResponse<unknown>> {
    return await this.amrService.updateMember(body);
  }

  @Delete()
  public async removeMember(
    @Query("id", new ParseUUIDPipe()) id: string
  ): Promise<ApiResponse<unknown>> {
    return await this.amrService.removeMember(id);
  }
}
