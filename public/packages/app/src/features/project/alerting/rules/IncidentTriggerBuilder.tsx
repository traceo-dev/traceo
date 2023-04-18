import { PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Select } from "@traceo/ui";
import React, { useState } from "react";
import { AlertRule, LOGICAL_OPERATORS_OPTIONS, LogicOperator } from "./utils";
import { IncidentConditionRow } from "./IncidentRuleRow";
import { RowContainer } from "../CreateAlertPage";

interface Props {
  rules: AlertRule[];
  setLogicOperator: (o: LogicOperator) => void;
  onRemove: (c: AlertRule) => void;
  onAddRule: () => void;
}
export const IncidentTriggerBuilder = ({
  rules,
  onRemove,
  onAddRule,
  setLogicOperator
}: Props) => {
  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex flex-row items-center gap-x-2 text-primary">
        <span>Trigger when your incident matches</span>
        <Select
          onChange={(e) => setLogicOperator(e?.value)}
          width={70}
          options={LOGICAL_OPERATORS_OPTIONS}
        />
        <span>of the following rules</span>
      </div>

      {rules.length === 0 && (
        <RowContainer>
          <div className="w-full text-center justify-center py-5">
            <span>Rules not defined</span>
          </div>
        </RowContainer>
      )}

      {rules?.map((condition) => (
        <IncidentConditionRow key={condition.uuid} condition={condition} onRemove={onRemove} />
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
