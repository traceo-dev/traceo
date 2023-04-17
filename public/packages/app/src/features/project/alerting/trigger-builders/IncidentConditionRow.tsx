import { MinusOutlined } from "@ant-design/icons";
import { Input, Select, SelectOptionProps } from "@traceo/ui";
import { useEffect, useState } from "react";
import {
  IncidentPrimaryCondition,
  INCIDENT_FIELD_OPTIONS,
  OPERATOR_OPTIONS,
  Condition,
  TIME_OPTIONS,
  IncidentField,
  OperatorEnum
} from "./utils";
import { PaginateType, IIncident } from "@traceo/types";
import { useReactQuery } from "src/core/hooks/useReactQuery";
import { useParams } from "react-router-dom";

interface Props {
  condition: Condition;
  setCondition?: (c: Condition) => void;
  onRemove: (e: Condition) => void;
}

const BASE_CONDITIONS: SelectOptionProps[] = [
  {
    label: "When occur a new incident",
    value: IncidentPrimaryCondition.OCCUR_NEW_INCIDENT
  },
  {
    label: "When occur a new incident with {field} {operator} {value}",
    value: IncidentPrimaryCondition.OCCUR_NEW_INCIDENT_WITH
  },
  {
    label: "The number of new incident is more than {value} in last {time_period}",
    value: IncidentPrimaryCondition.OCCUR_MORE_THAN
  },
  {
    label: "When incident change state from resolved to unresolved",
    value: IncidentPrimaryCondition.INCIDENT_CHANGED_STATUS
  },
  {
    label:
      "The number of events for incident {incident} is more than {value} in last {time_period}",
    value: IncidentPrimaryCondition.EVENTS_NUMBER_INTERVAL
  }
];

interface ConditionComponentProps {
  condition: Condition;
}

const EventsNumberIntervalComponent = ({ condition }: ConditionComponentProps) => {
  const { id } = useParams();

  const [count, setCount] = useState<string>();
  const [time, setTime] = useState<number>();
  const [incident, setIncident] = useState<string>();

  const { data: response, isFetching } = useReactQuery<PaginateType<IIncident>>({
    queryKey: ["incidents"],
    url: "/api/incidents",
    params: { id, order: "DESC" }
  });

  const incidentsOptions = (): SelectOptionProps[] => {
    return response?.result?.map((e) => ({
      label: e.name,
      description: e.message,
      value: e.id
    }));
  };

  /**
   * count: number;
   * time: number; //in minutes
   * incident: string; //id
   */
  useEffect(() => {
    condition.type = IncidentPrimaryCondition.EVENTS_NUMBER_INTERVAL;
    condition["count"] = count;
    condition["time"] = time;
    condition["incident"] = incident;
  }, [count, time, incident]);

  return (
    <div className="flex flex-row items-center gap-x-2">
      <span>The number of events captured for incident</span>
      <Select
        isLoading={isFetching}
        onChange={(e) => setIncident(e?.value)}
        options={incidentsOptions()}
      />
      <span>is more than</span>
      <Input type="number" max={999} onChange={(e) => setCount(e.currentTarget.value)} />
      <span>in last</span>
      <Select onChange={(e) => setTime(e?.value)} options={TIME_OPTIONS} />
    </div>
  );
};

const OccurMoreThanComponent = ({ condition }: ConditionComponentProps) => {
  const [count, setCount] = useState<string>(null);
  const [time, setTime] = useState<number>();

  /**
   * count: number;
   * time: number; //in minutes
   */
  useEffect(() => {
    condition.type = IncidentPrimaryCondition.OCCUR_MORE_THAN;
    condition["count"] = count;
    condition["time"] = time;
  }, [count, time]);

  return (
    <div className="flex flex-row gap-x-2 items-center">
      <span>When occurs incidents is more than</span>
      <Input type="number" max={999} onChange={(e) => setCount(e.currentTarget.value)} />
      <span>times in last</span>
      <Select onChange={(e) => setTime(e?.value)} options={TIME_OPTIONS} />
    </div>
  );
};

const ChangedStatusComponent = ({ condition }: ConditionComponentProps) => {
  useEffect(() => {
    condition.type = IncidentPrimaryCondition.INCIDENT_CHANGED_STATUS;
  }, [condition]);
  return <span>When incident change state from resolved to unresolved</span>;
};

const OccurNewIncidentComponent = ({ condition }: ConditionComponentProps) => {
  useEffect(() => {
    condition.type = IncidentPrimaryCondition.OCCUR_NEW_INCIDENT;
  }, [condition]);
  return <span>When occur a new incident</span>;
};

const OccureNewIncidentWithComponent = ({ condition }: ConditionComponentProps) => {
  const [field, setField] = useState<IncidentField>(null);
  const [operator, setOperator] = useState<OperatorEnum>(null);
  const [value, setValue] = useState<string>(null);

  useEffect(() => {
    condition.type = IncidentPrimaryCondition.OCCUR_NEW_INCIDENT_WITH;
    condition["field"] = field;
    condition["operator"] = operator;
    condition["value"] = value;
  }, [field, operator, value, condition]);

  return (
    <div className="flex flex-row items-center gap-x-2">
      <span>When occur a new incident with</span>
      <Select onChange={(e) => setField(e?.value)} options={INCIDENT_FIELD_OPTIONS} />
      <Select onChange={(e) => setOperator(e?.value)} options={OPERATOR_OPTIONS} />
      <Input onChange={(e) => setValue(e.currentTarget.value)} />
    </div>
  );
};

export const IncidentConditionRow = ({ onRemove, condition }: Props) => {
  const [primaryCondition, setPrimaryCondition] = useState(null);

  const handleRemove = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    onRemove(condition);
  };

  const mapConditionToComponent: Record<IncidentPrimaryCondition, JSX.Element> = {
    [IncidentPrimaryCondition.OCCUR_MORE_THAN]: <OccurMoreThanComponent condition={condition} />,
    [IncidentPrimaryCondition.INCIDENT_CHANGED_STATUS]: (
      <ChangedStatusComponent condition={condition} />
    ),
    [IncidentPrimaryCondition.OCCUR_NEW_INCIDENT]: (
      <OccurNewIncidentComponent condition={condition} />
    ),
    [IncidentPrimaryCondition.OCCUR_NEW_INCIDENT_WITH]: (
      <OccureNewIncidentWithComponent condition={condition} />
    ),
    [IncidentPrimaryCondition.EVENTS_NUMBER_INTERVAL]: (
      <EventsNumberIntervalComponent condition={condition} />
    )
  };

  return (
    <div className="justify-between text-primary flex flex-row gap-x-5 border border-solid border-light-secondary rounded p-5 items-center">
      {primaryCondition && mapConditionToComponent[primaryCondition]}
      {!primaryCondition && (
        <Select
          width={450}
          placeholder="Select condition"
          onChange={(e) => setPrimaryCondition(e?.value)}
          options={BASE_CONDITIONS}
        />
      )}
      <MinusOutlined
        className="bg-red-500 p-1 rounded-full cursor-pointer hover:bg-red-700 duration-200"
        onClick={handleRemove}
      />
    </div>
  );
};
