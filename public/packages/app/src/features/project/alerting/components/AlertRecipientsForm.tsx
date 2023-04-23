import { Typography, Switch } from "@traceo/ui";
import { AlertRecipients } from "./AlertRecipients";
import { IMember, Setter } from "@traceo/types";
import { Section, SectionHeader, SectionContent, NotificationSwitchWrapper } from "../utils";

interface Props {
  isAllMembers: boolean;
  setAllMembers: Setter<boolean>;
  selectedMembers: IMember[];
  setSelectedMembers: Setter<IMember[]>;
}
export const AlertRecipientsForm = ({
  isAllMembers = false,
  selectedMembers = [],
  setAllMembers,
  setSelectedMembers
}: Props) => {
  return (
    <Section>
      <SectionHeader
        index={5}
        title="Alert recipients"
        description="Choose who should receive alert notifications or check the box below to select
          all members of this app."
      />
      <SectionContent>
        <NotificationSwitchWrapper>
          <div className="flex flex-col">
            <Typography size="md" weight="semibold">
              All members
            </Typography>
            <Typography size="xs">
              Send an alert notification to all members of this project.
            </Typography>
          </div>
          <Switch value={isAllMembers} onChange={(e) => setAllMembers(e.target["checked"])} />
        </NotificationSwitchWrapper>
        {!isAllMembers && (
          <AlertRecipients
            selectedMembers={selectedMembers}
            setSelectedMembers={setSelectedMembers}
          />
        )}
      </SectionContent>
    </Section>
  );
};
