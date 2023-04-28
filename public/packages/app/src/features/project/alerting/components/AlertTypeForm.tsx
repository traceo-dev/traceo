import { ChooseElementGrid } from "../../../../core/components/ChooseElementGrid";
import { Section, SectionHeader, SectionContent, alertOptions } from "../utils";
import { AlertEnumType, Setter } from "@traceo/types";

interface Props {
  alertType: AlertEnumType;
  setAlertType: Setter<AlertEnumType>;
}
export const AlertTypeForm = ({ alertType = AlertEnumType.INCIDENT, setAlertType }: Props) => {
  return (
    <Section>
      <SectionHeader
        index={1}
        title="Choose alert type"
        description="The creation of conditions to trigger alerts depends on the selected alert type. Choose the one that suits your needs."
      />
      <SectionContent>
        <ChooseElementGrid options={alertOptions} onSelect={setAlertType} selected={alertType} />
      </SectionContent>
    </Section>
  );
};
