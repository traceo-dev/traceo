import { Injectable } from "@nestjs/common";
import { sendMail } from "src/libs/nodemailer";
import { WorkspaceQueryService } from "src/workspace/workspace-query/workspace-query.service";

enum EMAIL_TYPE {
    CONFIRM_REGISTRATION = 'confirmRegistration',
    WORKSPACE_INVITE_NO_ACCOUNT = 'workspaceInviteNoAccount',
    WORKSPACE_INVITE_ACCOUNT = 'workspaceInviteAccount'
}

@Injectable()
export class MailingService {
    constructor(
        private readonly workspaceQueryService: WorkspaceQueryService
    ) { }

    public async sendInviteToMemberWithoutAccount(
    { 
        email,
        url,
        workspaceId
    }: {
        email: string,
        url: string,
        workspaceId: string
    }): Promise<void> {
        const workspace = await this.workspaceQueryService.getDto(workspaceId);
        const mailParams = {
            to: email,
            subject: "Invite",
            context: {
                link: url,
                workspaceName: workspace?.name,
                app_name: process.env.APP_NAME,
            },
            template: EMAIL_TYPE.WORKSPACE_INVITE_NO_ACCOUNT,
        };
        await sendMail(mailParams);
    };

    public async sendInviteToMember(
        {
            email,
            url,
            accountName,
            workspaceId
        }: {
            email: string,
            url: string,
            accountName: string,
            workspaceId: string
        }): Promise<void> {
        const workspace = await this.workspaceQueryService.getDto(workspaceId);
        const mailParams = {
            to: email,
            subject: "Invite",
            context: {
                link: url,
                accountName: accountName,
                workspaceName: workspace?.name,
                app_name: process.env.APP_NAME,
            },
            template: EMAIL_TYPE.WORKSPACE_INVITE_ACCOUNT,
        };
        await sendMail(mailParams);
    };

    public async sendSignUpConfirmation(email: string, url: string): Promise<void> {
        const mailParams = {
            to: email,
            subject: "Confirm registration",
            context: {
                link: url,
                appName: process.env.APP_NAME,
            },
            template: EMAIL_TYPE.CONFIRM_REGISTRATION,
        };
        await sendMail(mailParams);
    };
}