import { Injectable } from "@nestjs/common";
import { sendMail } from "src/mailing/nodemailer";
import { ApplicationQueryService } from "src/application/application-query/application-query.service";

enum EMAIL_TYPE {
  CONFIRM_REGISTRATION = 'confirmRegistration',
  APPLICATION_INVITE_NO_ACCOUNT = 'applicationInviteNoAccount',
  APPLICATION_INVITE_ACCOUNT = "applicationInviteAccount",
}

@Injectable()
export class MailingService {
  constructor(
    private readonly applicationQueryService: ApplicationQueryService,
  ) {}

  public async sendInviteToMemberWithoutAccount({
    email,
    url,
    appId
  }: {
    email: string;
    url: string;
    appId: number;
  }): Promise<void> {
    const application = await this.applicationQueryService.getDto(appId);
    const mailParams = {
      to: email,
      subject: "Invite to Traceo",
      context: {
        link: url,
        appName: application?.name,
        traceo_name: process.env.TRACEO_APP_NAME,
      },
      template: EMAIL_TYPE.APPLICATION_INVITE_NO_ACCOUNT,
    };
    await sendMail(mailParams);
  }

  public async sendInviteToMember({
    email,
    url,
    accountName,
    appId
  }: {
    email: string;
    url: string;
    accountName: string;
    appId: number;
  }): Promise<void> {
    const application = await this.applicationQueryService.getDto(appId);
    const mailParams = {
      to: email,
      subject: "Invite to Traceo",
      context: {
        link: url,
        accountName,
        appName: application?.name,
        traceo_name: process.env.TRACEO_APP_NAME,
      },
      template: EMAIL_TYPE.APPLICATION_INVITE_ACCOUNT,
    };
    await sendMail(mailParams);
  }

  public async sendSignUpConfirmation(
    email: string,
    url: string,
  ): Promise<void> {
    const mailParams = {
      to: email,
      subject: "Confirm registration",
      context: {
        link: url,
        appName: process.env.TRACEO_APP_NAME,
      },
      template: EMAIL_TYPE.CONFIRM_REGISTRATION,
    };
    await sendMail(mailParams);
  }
}
