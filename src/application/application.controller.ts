import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/auth/auth.model';
import { Application } from 'src/db/entities/application.entity';
import { AuthRequired } from 'src/libs/decorators/auth-required.decorator';
import { AuthAccount } from 'src/libs/decorators/auth-user.decorator';
import { ApplicationResponse } from 'src/types/application';
import { ApplicationQueryService } from './application-query/application-query.service';
import { CreateApplicationBody, ApplicationBody } from './application.model';
import { ApplicationService } from './application.service';

@ApiTags('application')
@Controller('application')
export class ApplicationController {
    constructor(
        readonly applicationService: ApplicationService,
        readonly applicationQueryService: ApplicationQueryService
    ) {}

    @Get()
    @AuthRequired()
    async getApplication(
        @Query('id') id: number,
        @AuthAccount() user: RequestUser
    ): Promise<ApplicationResponse | null> {
        return await this.applicationQueryService.getApplication(id, user);
    }

    @Post()
    @AuthRequired()
    async createApplication(
        @Body() body: CreateApplicationBody,
        @AuthAccount() account: RequestUser
    ): Promise<Application> {
        return await this.applicationService.createApplication(body, account)
    }

    @Patch()
    @AuthRequired()
    async updateApplication(
        @Body() body: ApplicationBody,
        @AuthAccount() account: RequestUser
    ): Promise<void> {
        return await this.applicationService.updateApplication(body, account);
    }

    @Delete('/:id')
    @AuthRequired()
    public async deleteApplication(
        @Param("id") id: string,
        @AuthAccount() account: RequestUser
    ): Promise<void> {
        return await this.applicationService.deleteApplication(id, account);
    }
}