import { MinusOutlined } from "@ant-design/icons";
import { Select, SelectOptionProps } from "@traceo/ui";
import { useEffect, useState } from "react";
import { INCIDENT_BASE_RULES } from "./types";
import { Updater } from "use-immer";
import { incidentRulesForm } from "./incidentRuleForm";
import { IAlertRule, Setter } from "@traceo/types";

interface Props {
  index: number;
  rule: IAlertRule;
  setRules: Updater<IAlertRule[]>;
  setCondition?: Setter<IAlertRule>;
  onRemove: Setter<IAlertRule>;
  incidentOptions: SelectOptionProps[];
}

export const IncidentRuleRow = ({
  rule = null,
  index = null,
  setRules,
  onRemove,
  incidentOptions = []
}: Props) => {
  const [currentRule, setCurrentRule] = useState<string>(rule?.type);

  const handleRemove = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    onRemove(rule);
  };

  useEffect(() => {
    setRules((opt) => {
      opt[index].type = currentRule;
    });
  }, [currentRule]);

  const rules = incidentRulesForm({
    index,
    type: currentRule,
    rule,
    setRule: setRules,
    incidentOptions
  }).map((e, key) => {
    if (typeof e.component === "string") {
      return <span key={key}>{e.component}</span>;
    }

    return <div key={key}>{e.component}</div>;
  });

  return (
    <div className="justify-between text-primary flex flex-row gap-x-5 border border-solid border-light-secondary rounded p-5 items-center">
      {currentRule && <div className="flex flex-row items-center gap-x-2">{rules}</div>}

      {!currentRule && (
        <Select
          width={450}
          defaultValue={rule?.type}
          placeholder="Select rule"
          onChange={(e) => setCurrentRule(e?.value)}
          options={INCIDENT_BASE_RULES}
        />
      )}
      <MinusOutlined
        className="bg-red-500 p-1 rounded-full cursor-pointer hover:bg-red-700 duration-200"
        onClick={handleRemove}
      />
    </div>
  );
};
