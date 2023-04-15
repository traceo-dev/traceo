import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Input, Row, Select, SelectOptionProps, Switch } from "@traceo/ui";
import { useState } from "react";
import styled from "styled-components";

const TokenSpan = styled.span`
  background-color: #eab308;
  padding-inline: 12px;
  border-radius: 4px;
  color: #000000;
  font-size: 12px;
  font-weight: 500;
  max-width: min-content;
  white-space: nowrap;
`;

type Condition = {
  id: number;
};

// all -> AND, any -> OR
enum LogicOperator {
  ALL = "all",
  ANY = "any"
}
const LOGICAL_OPERATORS_OPTIONS: SelectOptionProps[] = [
  { label: "all", value: LogicOperator.ALL },
  { label: "any", value: LogicOperator.ANY }
];

interface Props {
  condition: Condition;
  onRemoveCondition: (c: Condition) => void;
}

export enum IncidentPrimaryCondition {
  OCCUR_NEW_INCIDENT = "occur_new_incident",
  OCCUR_NEW_INCIDENT_WITH = "occur_new_incident_with",
  OCCUR_MORE_THAN = "occur_more_than"
  //   INCIDENT_CHANGED_STATUS = "incident_changed_status",
  //   INCIDENT_CHANGED_ASSIGNED = "incident_changed_assigned"
}

const BASE_CONDITIONS: SelectOptionProps[] = [
  {
    label: "When occur a new incident",
    value: IncidentPrimaryCondition.OCCUR_NEW_INCIDENT
  },
  {
    label: "When occur a new incident with",
    value: IncidentPrimaryCondition.OCCUR_NEW_INCIDENT_WITH
  },
  {
    label: "When occur more than",
    value: IncidentPrimaryCondition.OCCUR_MORE_THAN
  }
];

enum OperatorEnum {
  STARTS_WITH = "starts_with",
  LIKE = "like",
  EQUALS = "equals"
}

const OPERATOR_OPTIONS: SelectOptionProps[] = [
  { label: "starts with", value: OperatorEnum.STARTS_WITH },
  { label: "like", value: OperatorEnum.LIKE },
  { label: "equals", value: OperatorEnum.EQUALS }
];

enum IncidentField {
  NAME = "name",
  MESSAGE = "message"
}

const INCIDENT_FIELD_OPTIONS: SelectOptionProps[] = [
  { label: "name", value: IncidentField.NAME },
  { label: "message", value: IncidentField.MESSAGE }
];

enum TimeUnit {
  HOURS = "hours",
  MINUTES = "min",
  DAYS = "days"
}

const TIME_UNIT_OPTIONS: SelectOptionProps[] = [
  { label: "hours", value: TimeUnit.HOURS },
  { label: "minutes", value: TimeUnit.MINUTES },
  { label: "days", value: TimeUnit.DAYS }
];

const IncidentConditionRow = ({ onRemoveCondition, condition }: Props) => {
  const [primaryCondition, setPrimaryCondition] = useState(null);
  const [condition2, setCondition2] = useState(null);
  const [condition3, setCondition3] = useState(null);

  return (
    <div className="text-primary flex flex-row gap-x-5 border border-solid border-light-secondary rounded p-5 items-center">
      <MinusOutlined
        className="bg-red-500 p-1 rounded-full cursor-pointer hover:bg-red-700 duration-200"
        onClick={() => onRemoveCondition(condition)}
      />

      <>
        <Select
          placeholder="Select condition"
          width={300}
          onChange={(e) => setPrimaryCondition(e?.value)}
          options={BASE_CONDITIONS}
        />

        {primaryCondition === IncidentPrimaryCondition.OCCUR_MORE_THAN && (
          <>
            <Input placeholder="Incidents count" />
            <span>new incidents in last</span>
            <Input placeholder="Time count" />
            <Select
              placeholder="Select time unit"
              width={250}
              onChange={(e) => setCondition2(e?.value)}
              options={TIME_UNIT_OPTIONS}
            />
          </>
        )}

        {primaryCondition === IncidentPrimaryCondition.OCCUR_NEW_INCIDENT_WITH && (
          <>
            <Select
              placeholder="Select field"
              width={250}
              onChange={(e) => setCondition3(e?.value)}
              options={INCIDENT_FIELD_OPTIONS}
            />

            {condition3 && (
              <>
                <Select
                  placeholder="Select operator"
                  width={250}
                  onChange={(e) => setCondition2(e?.value)}
                  options={OPERATOR_OPTIONS}
                />

                {condition2 && <Input placeholder="Provide value" />}
              </>
            )}
          </>
        )}
      </>
    </div>
  );
};

export const IncidentTriggerBuilder = () => {
  const [conditions, setConditions] = useState<Condition[]>([{ id: 0 }]);

  const [builderOperator, setBuilderOperator] = useState<LogicOperator>(LogicOperator.ANY);

  const onAddCondition = () => {
    setConditions([...conditions, { id: conditions?.length + 1 }]);
  };

  const onRemoveCondition = (condition: Condition) => {
    setConditions(conditions.filter((con) => con !== condition));
  };

  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex flex-row items-center gap-x-2 text-primary">
        <span>Trigger when an incoming incident matches</span>
        <Select
          onChange={(e) => setBuilderOperator(e?.value)}
          width={70}
          value={builderOperator}
          options={LOGICAL_OPERATORS_OPTIONS}
        />
        <span>of the following conditions</span>
      </div>

      {conditions.length === 0 && (
        <div className="w-1/2">
          <Alert message="No conditions defined" type="warning" />
        </div>
      )}

      {conditions.map((condition, index) => (
        <IncidentConditionRow
          condition={condition}
          onRemoveCondition={() => onRemoveCondition(condition)}
          key={index}
        />
      ))}
      {conditions?.length === 5 && (
        <span className="text-xs text-primary">You can provide at most 3 conditions.</span>
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
