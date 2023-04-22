import {
  AlertOutlined,
  AlignLeftOutlined,
  BarChartOutlined,
  RocketOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  StopOutlined
} from "@ant-design/icons";
import { AlertEnumType, IAlertRule, AlertStatus, AlertSeverity } from "@traceo/types";
import { SelectOptionProps, Tag } from "@traceo/ui";

export const mapAlertTypeToIcon: Record<AlertEnumType, JSX.Element> = {
  [AlertEnumType.INCIDENT]: <AlertOutlined />,
  [AlertEnumType.LOGS]: <AlignLeftOutlined />,
  [AlertEnumType.METRIC]: <BarChartOutlined />,
  [AlertEnumType.PERFORMANCE]: <RocketOutlined />
};

export const mapRuleTypeToString = (rule: Partial<IAlertRule>) => {
  const type = rule.type;

  switch (type) {
    case "occur_new_incident":
      return "When new incident occur";
    case "occur_new_incident_with":
      return `When new incident occur with ${rule.field} ${rule.operator} ${rule.value}`;
    case "occur_more_than":
      return `The number of new incident is more than ${rule.value} in last ${rule.time} minutes`;
    case "incident_changed_status":
      return `When incident change state from resolved to unresolved`;
    case "events_number_interval":
      return `The number of events for incident ${rule.incidentId} is more than ${rule.count} in last ${rule.time} mintues`;
    default:
      return type;
  }
};

export const mapStatusToTag: Record<AlertStatus, JSX.Element> = {
  [AlertStatus.ACTIVE]: <Tag color="green">Active</Tag>,
  [AlertStatus.INACTIVE]: <Tag color="gray">Inactive</Tag>,
  [AlertStatus.MUTED]: <Tag>Muted</Tag>
};

export const mapSeverityToSpan: Record<AlertSeverity, JSX.Element> = {
  [AlertSeverity.INFO]: (
    <div className="flex flex-row gap-x-2 items-center">
      <InfoCircleOutlined />
      <span>Info</span>
    </div>
  ),
  [AlertSeverity.WARNING]: (
    <div className="flex flex-row gap-x-2 items-center">
      <WarningOutlined />
      <span>Warning</span>
    </div>
  ),
  [AlertSeverity.CRITICAL]: (
    <div className="flex flex-row gap-x-2 items-center">
      <StopOutlined />
      <span>Critical</span>
    </div>
  )
};

export const mapAlertTypeToName: Record<AlertEnumType, string> = {
  [AlertEnumType.INCIDENT]: "Incident",
  [AlertEnumType.LOGS]: "Logs",
  [AlertEnumType.METRIC]: "Metric",
  [AlertEnumType.PERFORMANCE]: "Web performance"
};

export const alertOptions: SelectOptionProps[] = [
  {
    label: "Incidents",
    value: AlertEnumType.INCIDENT,
    icon: <AlertOutlined className="text-3xl text-yellow-500" />
  },
  {
    label: "Web performance",
    value: AlertEnumType.PERFORMANCE,
    icon: <RocketOutlined className="text-3xl text-yellow-500" />
  },
  {
    label: "Metrics",
    value: AlertEnumType.METRIC,
    icon: <BarChartOutlined className="text-3xl text-yellow-500" />
  },
  {
    label: "Logs",
    value: AlertEnumType.LOGS,
    icon: <AlignLeftOutlined className="text-3xl text-yellow-500" />
  }
];
