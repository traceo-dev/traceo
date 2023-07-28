import {
  AlertOutlined,
  AlignLeftOutlined,
  BarChartOutlined,
  RocketOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  StopOutlined
} from "@ant-design/icons";
import {
  AlertEnumType,
  IAlertRule,
  AlertStatus,
  AlertSeverity,
  OperatorEnum,
  IAlert
} from "@traceo/types";
import { Row, SelectOptionProps, Tag, Tooltip, toTitleCase } from "@traceo/ui";
import styled from "styled-components";
import { TIME_OPTIONS } from "./rules/types";
import dayjs from "dayjs";

export type AlertFormType = {
  name: string;
  description: string;
  severity: AlertSeverity;
  minNotifyInterval: number;
};

export const mapAlertTypeToIcon: Record<AlertEnumType, JSX.Element> = {
  [AlertEnumType.INCIDENT]: <AlertOutlined />,
  [AlertEnumType.LOGS]: <AlignLeftOutlined />,
  [AlertEnumType.METRIC]: <BarChartOutlined />,
  [AlertEnumType.PERFORMANCE]: <RocketOutlined />
};

export const mapRuleTypeToString = (rule: Partial<IAlertRule>) => {
  const type = rule.type;

  const time = TIME_OPTIONS.find(({ value }) => value === Number(rule.time));

  const mapOperator: Record<OperatorEnum, string> = {
    [OperatorEnum.EQUALS]: "equals",
    [OperatorEnum.LIKE]: "like",
    [OperatorEnum.STARTS_WITH]: "starts with"
  };

  switch (type) {
    case "occur_new_incident":
      return "When new incident occur";
    case "occur_new_incident_with":
      return `When new incident occur with ${rule.field} ${mapOperator[rule.operator]} ${
        rule.value
      }`;
    case "occur_more_than":
      return `The number of new incident is more than ${rule.count} in last ${time?.label}`;
    case "incident_changed_status":
      return `When incident change state from resolved to unresolved`;
    case "events_number_interval":
      return `The number of events for incident ${rule.incidentId} is more than ${rule.count} in last ${time?.label}`;
    default:
      return type;
  }
};

export const mapStatusToTag = (alert: IAlert) => {
  const tag: Record<AlertStatus, JSX.Element> = {
    [AlertStatus.ACTIVE]: <Tag color="green">Active</Tag>,
    [AlertStatus.INACTIVE]: <Tag color="gray">Inactive</Tag>,
    [AlertStatus.MUTED]: (
      <Tooltip title={`Mute end at ${dayjs.unix(alert.mutedEndAt).format("DD-MM-YYYY HH:mm")}`}>
        <Tag>Muted</Tag>
      </Tooltip>
    )
  };

  return tag[alert.status];
};

export const mapSeverityIcon: Record<AlertSeverity, JSX.Element> = {
  [AlertSeverity.INFO]: <InfoCircleOutlined className="text-blue-500" />,
  [AlertSeverity.WARNING]: <WarningOutlined className="text-yellow-500" />,
  [AlertSeverity.CRITICAL]: <StopOutlined className="text-red-500" />
};

export const mapSeverityToSpan: Record<AlertSeverity, JSX.Element> = {
  [AlertSeverity.INFO]: (
    <Row gap="x-2">
      {mapSeverityIcon[AlertSeverity.INFO]}
      <span className="text-2xs">Info</span>
    </Row>
  ),
  [AlertSeverity.WARNING]: (
    <Row gap="x-2">
      {mapSeverityIcon[AlertSeverity.WARNING]}
      <span className="text-2xs">Warning</span>
    </Row>
  ),
  [AlertSeverity.CRITICAL]: (
    <Row gap="x-2">
      {mapSeverityIcon[AlertSeverity.CRITICAL]}
      <span className="text-2xs">Critical</span>
    </Row>
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
    label: "Metrics",
    value: AlertEnumType.METRIC,
    icon: <BarChartOutlined className="text-3xl text-yellow-500" />
  }
];

export const Section = styled.div`
  width: 100%;
  padding-bottom: 65px;
  display: flex;
  flex-direction: column;
  color: var(--color-text-primary);
`;

export const SectionContent = styled.div`
  padding-inline: 25px;
`;

export const SectionHeader = ({ title, description = null, index }) => {
  return (
    <Row className="text-primary mb-5">
      <span className="text-xl font-semibold">{index}.</span>
      <div className="flex flex-col pl-3">
        <span className="font-semibold text-xl text-primary">{title}</span>
        {description && <span className="text-sm text-primary">{description}</span>}
      </div>
    </Row>
  );
};

export const NotificationSwitchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 15px;
  justify-content: space-between;
  width: 100%;
`;

export const RowContainer = styled.div`
  width: 100%;
  justify-content: space-between;
  color: var(--color-text-primary);
  display: flex;
  flex-direction: row;
  gap-row: 12px;
  border: 1px solid var(--color-bg-light-secondary);
  border-radius: 6px;
  padding: 9px;
  padding-inline: 12px;
  align-items: center;
  margin-bottom: 9px;
`;

export const alertStatusOptions: SelectOptionProps[] = Object.values(AlertStatus).map((e) => ({
  label: toTitleCase(e),
  value: e
}));

export enum AlertSortBy {
  LAST_TRIGGERED = "lastTriggered",
  CREATED = "createdAt",
  STATUS = "status",
  SEVERITY = "severity"
}

export const mapSortOptionsLabel: Record<AlertSortBy, string> = {
  [AlertSortBy.LAST_TRIGGERED]: "Last triggered",
  [AlertSortBy.CREATED]: "Create date",
  [AlertSortBy.STATUS]: "Status",
  [AlertSortBy.SEVERITY]: "Severity"
};

export const alertSortOptions: SelectOptionProps[] = Object.values(AlertSortBy).map((e) => ({
  label: mapSortOptionsLabel[e],
  value: e
}));
