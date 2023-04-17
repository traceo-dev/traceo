import { PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Select } from "@traceo/ui";
import React, { useState } from "react";
import { Condition, LOGICAL_OPERATORS_OPTIONS, LogicOperator } from "./utils";
import { IncidentConditionRow } from "./IncidentConditionRow";
import { RowContainer } from "../CreateAlertPage";

interface Props {
  conditions: Condition[];
  setLogicOperator: (o: LogicOperator) => void;
  onRemove: (c: Condition) => void;
  onAddCondition: () => void;
}
export const IncidentTriggerBuilder = ({
  conditions,
  onRemove,
  onAddCondition,
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
        <span>of the following conditions</span>
      </div>

      {conditions.length === 0 && (
        <RowContainer>
          <div className="w-full text-center justify-center py-5">
            <span>Conditions not defined</span>
          </div>
        </RowContainer>
      )}

      {conditions?.map((condition) => (
        <IncidentConditionRow key={condition.uuid} condition={condition} onRemove={onRemove} />
      ))}

      {conditions?.length === 5 && (
        <span className="text-xs text-primary">You can provide at most 5 conditions.</span>
      )}

      <Button
        disabled={conditions?.length === 5}
        icon={<PlusOutlined />}
        onClick={onAddCondition}
      >
        Add new condition
      </Button>
    </div>
  );
};
