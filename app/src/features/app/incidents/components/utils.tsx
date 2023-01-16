import {
  CheckCircleOutlined,
  WarningOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
  LineChartOutlined
} from "@ant-design/icons";
import { Avatar } from "core/ui-components/Avatar";
import { SelectOptionProps } from "core/ui-components/Select/types";
import React from "react";
import { ApplicationMember } from "types/application";
import {
  IncidentStatus,
  handleIncidentStatus,
  IncidentSortBy,
  IncidentStatusSearch
} from "types/incidents";

export const assignOptions = (members: ApplicationMember[]) =>
  members?.map((member: ApplicationMember) => ({
    label: member.name,
    description: member?.email,
    value: member.accountId,
    icon: <Avatar alt={member.name} src={member.gravatar} size="sm" />
  }));

export const handleIncidentTwTextColor: Record<IncidentStatus, string> = {
  [IncidentStatus.RESOLVED]: "text-green-500",
  [IncidentStatus.UNRESOLVED]: "text-red-500",
  [IncidentStatus.IN_PROGRESS]: "text-purple-500"
};

export const handleIncidentTwBgColor: Record<IncidentStatus, string> = {
  [IncidentStatus.RESOLVED]: "bg-green-700",
  [IncidentStatus.UNRESOLVED]: "bg-red-700",
  [IncidentStatus.IN_PROGRESS]: "bg-purple-700"
};

export const handleIncidentStatusIcon: Record<IncidentStatus, JSX.Element> = {
  [IncidentStatus.RESOLVED]: <CheckCircleOutlined />,
  [IncidentStatus.UNRESOLVED]: <WarningOutlined />,
  [IncidentStatus.IN_PROGRESS]: <ThunderboltOutlined />
};

export const statusOptions: SelectOptionProps[] = Object.values(IncidentStatus).map(
  (status) => ({
    value: status,
    label: handleIncidentStatus[status],
    icon: React.cloneElement(handleIncidentStatusIcon[status], {
      className: handleIncidentTwTextColor[status]
    })
  })
);

export const handleIncidentSortName: Record<IncidentSortBy, string> = {
  [IncidentSortBy.FIRST_SEEN]: "First seen",
  [IncidentSortBy.LAST_SEEN]: "Last seen",
  [IncidentSortBy.ERRORS_COUNT]: "Errors count",
  [IncidentSortBy.STATUS]: "Status"
};

export const searchStatusOptions: SelectOptionProps[] = Object.values(
  IncidentStatusSearch
).map((status) => ({
  label: handleIncidentStatus[status],
  value: status
}));

export const sortOptions = Object.values(IncidentSortBy).map((sort) => ({
  label: handleIncidentSortName[sort],
  value: sort
}));

export const changeBarOptions = [
  {
    icon: <BarChartOutlined />,
    value: "bar"
  },
  {
    icon: <LineChartOutlined />,
    value: "line"
  }
];
