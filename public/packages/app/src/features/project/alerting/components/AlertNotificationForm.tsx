import { Typography, Switch, Tooltip } from "@traceo/ui";
import { Section, SectionHeader, SectionContent, NotificationSwitchWrapper } from "../utils";
import { Setter } from "@traceo/types";

interface Props {
  isInAppNotify: boolean;
  setInAppNotify: Setter<boolean>;
  isEmailNotify: boolean;
  setEmailNotify: Setter<boolean>;
}
export const AlertNotificationForm = ({
  isInAppNotify = true,
  isEmailNotify = false,
  setEmailNotify,
  setInAppNotify
}: Props) => {
  return (
    <Section>
      <SectionHeader
        index={4}
        title="Notifications"
        description="Select a notification type and assign users who should be notified when this alert occurs."
      />
      <SectionContent>
        <NotificationSwitchWrapper>
          <div className="flex flex-col">
            <Typography size="md" weight="semibold">
              In-app
            </Typography>
            <Typography size="xs">
              Delivery of internal notifications in the Traceo application.
            </Typography>
          </div>
          <Switch
            disabled
            value={isInAppNotify}
            onChange={(e) => setInAppNotify(e.target["checked"])}
          />
        </NotificationSwitchWrapper>
        <NotificationSwitchWrapper className="opacity-60">
          <div className="flex flex-col">
            <Typography size="md" weight="semibold">
              Email notifications
            </Typography>
            <Typography size="xs">
              An emails will be sent containing the information about this alert provided in the
              basic informations section.
            </Typography>
          </div>
          <Switch
            disabled
            value={isEmailNotify}
            onChange={(e) => setEmailNotify(e.target["checked"])}
          />
        </NotificationSwitchWrapper>
      </SectionContent>
    </Section>
  );
};
