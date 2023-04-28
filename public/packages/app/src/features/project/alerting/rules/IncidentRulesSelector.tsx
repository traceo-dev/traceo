import { PlusOutlined } from "@ant-design/icons";
import { Button, Select, SelectOptionProps } from "@traceo/ui";
import { LOGICAL_OPERATORS_OPTIONS, LogicOperator } from "./types";
import { IncidentRuleRow } from "./IncidentRuleRow";
import { RowContainer } from "../utils";
import { Updater } from "use-immer";
import { IAlertRule, IIncident, PaginateType, Setter } from "@traceo/types";
import { useParams } from "react-router-dom";
import { useReactQuery } from "../../../../core/hooks/useReactQuery";
import { v4 as uuid } from "uuid";

interface Props {
  rules: IAlertRule[];
  setRules: Updater<IAlertRule[]>;
  logicOperator: LogicOperator;
  setLogicOperator: Setter<LogicOperator>;
}
export const IncidentRulesSelector = ({
  rules,
  setRules,
  logicOperator,
  setLogicOperator
}: Props) => {
  const { id } = useParams();

  const { data: response } = useReactQuery<PaginateType<IIncident>>({
    queryKey: ["incidents"],
    url: "/api/incidents",
    params: { id, order: "DESC" }
  });

  const incidentsOptions = (): SelectOptionProps[] =>
    response?.result?.map((e) => ({
      label: e.name,
      description: e.message,
      value: e.id
    }));

  const onAddRule = () => {
    setRules((opt) => {
      return [...opt, { id: uuid() }];
    });
  };
  const onRemoveRule = (rule: IAlertRule) => setRules(rules.filter(({ id }) => id !== rule.id));

  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex flex-row items-center gap-x-2 text-primary">
        <span>Trigger when your incident matches</span>
        <Select
          width={70}
          defaultValue={logicOperator}
          onChange={(e) => setLogicOperator(e?.value)}
          options={LOGICAL_OPERATORS_OPTIONS}
        />
        <span>of the following rules</span>
      </div>

      {rules?.length === 0 && (
        <RowContainer>
          <div className="w-full text-center justify-center py-5">
            <span>Rules not defined</span>
          </div>
        </RowContainer>
      )}

      {rules?.map((rule, index) => (
        <IncidentRuleRow
          key={rule.id}
          index={index}
          rule={rule}
          setRules={setRules}
          onRemove={onRemoveRule}
          incidentOptions={incidentsOptions()}
        />
      ))}

      {rules?.length === 5 && (
        <span className="text-xs text-primary">You can provide at most 5 rules.</span>
      )}

      <Button disabled={rules?.length === 5} icon={<PlusOutlined />} onClick={onAddRule}>
        Add new condition
      </Button>
    </div>
  );
};
