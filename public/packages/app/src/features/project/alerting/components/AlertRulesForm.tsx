import { IAlertRule, LogicOperator, Setter } from "@traceo/types";
import { IncidentRulesSelector } from "../rules/IncidentRulesSelector";
import { Section, SectionHeader, SectionContent } from "../utils";
import { Updater } from "use-immer";

interface Props {
  rules: IAlertRule[];
  setRules: Updater<IAlertRule[]>;
  logicOperator: LogicOperator;
  setLogicOperator: Setter<LogicOperator>;
}
export const AlertRulesForm = ({
  logicOperator = LogicOperator.ALL,
  rules = [],
  setLogicOperator,
  setRules
}: Props) => {
  return (
    <Section>
      <SectionHeader
        index={3}
        title="Rules"
        description="Create a rules to tell us when this alert should be triggered"
      />
      <SectionContent>
        <IncidentRulesSelector
          rules={rules}
          setRules={setRules}
          logicOperator={logicOperator}
          setLogicOperator={setLogicOperator}
        />
      </SectionContent>
    </Section>
  );
};
