import { SelectOptionProps, Select, Input } from "@traceo/ui";
import { Updater } from "use-immer";
import { IncidentRule, TIME_OPTIONS, INCIDENT_FIELD_OPTIONS, OPERATOR_OPTIONS } from "./utils";
import { IAlertRule } from "@traceo/types";

type BuilderForm = {
  component?: string | JSX.Element;
};

interface RuleBuilderProps {
  index: number;
  type: string;
  rule: IAlertRule;
  setRule: Updater<IAlertRule[]>;
  incidentOptions?: SelectOptionProps[];
}

export const incidentRulesForm = ({
  index,
  type,
  rule,
  setRule,
  incidentOptions
}: RuleBuilderProps) => {
  const forms: BuilderForm[] = [];

  switch (type) {
    case IncidentRule.EVENTS_NUMBER_INTERVAL:
      forms.push({ component: "The number of events captured for incident" });
      forms.push({
        component: (
          <Select
            value={rule.incidentId}
            onChange={(e) => {
              setRule((opt) => {
                opt[index].incidentId = e?.value;
              });
            }}
            options={incidentOptions}
          />
        )
      });
      forms.push({ component: "is more than" });
      forms.push({
        component: (
          <Input
            type="number"
            defaultValue={rule["count"]}
            max={999}
            onChange={(e) => {
              setRule((opt) => {
                opt[index].count = e.target["value"];
              });
            }}
          />
        )
      });
      forms.push({ component: "in last" });
      forms.push({
        component: (
          <Select
            defaultValue={rule["time"] ? Number(rule.time) : null}
            onChange={(e) => {
              setRule((opt) => {
                opt[index].time = e?.value;
              });
            }}
            options={TIME_OPTIONS}
          />
        )
      });
      return forms;
    case IncidentRule.OCCUR_MORE_THAN:
      forms.push({ component: "When occurs incidents is more than" });
      forms.push({
        component: (
          <Input
            defaultValue={rule?.count}
            type="number"
            max={999}
            onChange={(e) => {
              setRule((opt) => {
                opt[index].count = e.target["value"];
              });
            }}
          />
        )
      });
      forms.push({ component: "times in last" });
      forms.push({
        component: (
          <Select
            defaultValue={rule["time"] ? Number(rule.time) : null}
            onChange={(e) => {
              setRule((opt) => {
                opt[index].time = e?.value;
              });
            }}
            options={TIME_OPTIONS}
          />
        )
      });

      return forms;
    case IncidentRule.INCIDENT_CHANGED_STATUS:
      forms.push({ component: "When incident change state from resolved to unresolved" });
      return forms;
    case IncidentRule.OCCUR_NEW_INCIDENT:
      forms.push({ component: "When occur a new incident" });
      return forms;
    case IncidentRule.OCCUR_NEW_INCIDENT_WITH:
      forms.push({ component: "When occur a new incident with" });
      forms.push({
        component: (
          <Select
            value={rule?.field}
            onChange={(e) => {
              setRule((opt) => {
                opt[index].field = e?.value;
              });
            }}
            options={INCIDENT_FIELD_OPTIONS}
          />
        )
      });
      forms.push({
        component: (
          <Select
            value={rule?.operator}
            onChange={(e) => {
              setRule((opt) => {
                opt[index].operator = e?.value;
              });
            }}
            options={OPERATOR_OPTIONS}
          />
        )
      });
      forms.push({
        component: (
          <Input
            defaultValue={rule?.value}
            onChange={(e) => {
              setRule((opt) => {
                opt[index].value = e.target["value"];
              });
            }}
          />
        )
      });
      return forms;
    default:
      return [];
  }
};
