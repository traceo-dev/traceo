import { Injectable } from "@nestjs/common";
import { sendMail } from "src/libs/nodemailer";

@Injectable()
export class MailingService {
    constructor() { }

    public async sendInviteToMemberWithoutAccount(
        email: string,
        url: string,
        workspaceName: string
    ): Promise<void> {
        const mailParams = {
            to: email,
            subject: "Invite",
            context: {
                link: url,
                workspaceName: workspaceName,
                app_name: process.env.APP_NAME,
            },
            template: "workspaceInviteNoAccount",
        };
        await sendMail(mailParams);
    };

    public async sendInviteToMember(
        email: string,
        url: string,
        accountName: string,
        workspaceName: string
    ): Promise<void> {
        const mailParams = {
            to: email,
            subject: "Invite",
            context: {
                link: url,
                accountName: accountName,
                workspaceName: workspaceName,
                app_name: process.env.APP_NAME,
            },
            template: "workspaceInviteAccount",
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
            template: "confirmRegistration",
        };
        await sendMail(mailParams);
    };
}