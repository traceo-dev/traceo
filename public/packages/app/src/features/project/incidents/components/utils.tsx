import {
  BarChartOutlined,
  LineChartOutlined,
  CheckCircleFilled,
  WarningFilled,
  ThunderboltFilled
} from "@ant-design/icons";
import {
  ProjectMember,
  IncidentStatus,
  mapIncidentStatus,
  IncidentSortBy,
  IncidentStatusSearch
} from "@traceo/types";
import { Avatar, SelectOptionProps } from "@traceo/ui";
import React from "react";

export const assignOptions = (members: ProjectMember[]) =>
  members?.map((member: ProjectMember) => ({
    label: member.name,
    description: member?.email,
    value: member.userId,
    icon: <Avatar alt={member.name} src={member.gravatar} size="sm" className="mt-1" />
  }));

export const mapIncidentTwTextColor: Record<IncidentStatus, string> = {
  [IncidentStatus.RESOLVED]: "text-green-500",
  [IncidentStatus.UNRESOLVED]: "text-red-500",
  [IncidentStatus.IN_PROGRESS]: "text-purple-500"
};

export const mapIncidentTwBgColor: Record<IncidentStatus, string> = {
  [IncidentStatus.RESOLVED]: "bg-green-700",
  [IncidentStatus.UNRESOLVED]: "bg-red-700",
  [IncidentStatus.IN_PROGRESS]: "bg-purple-700"
};

export const mapIncidentStatusIcon: Record<IncidentStatus, JSX.Element> = {
  [IncidentStatus.RESOLVED]: <CheckCircleFilled />,
  [IncidentStatus.UNRESOLVED]: <WarningFilled />,
  [IncidentStatus.IN_PROGRESS]: <ThunderboltFilled />
};

export const mapHeaderStatusIcon: Record<IncidentStatus, JSX.Element> = {
  [IncidentStatus.RESOLVED]: <CheckCircleFilled className="text-green-600" />,
  [IncidentStatus.UNRESOLVED]: <WarningFilled className="text-red-600" />,
  [IncidentStatus.IN_PROGRESS]: <ThunderboltFilled className="text-purple-600" />
};

export const statusOptions: SelectOptionProps[] = Object.values(IncidentStatus).map((status) => ({
  value: status,
  label: mapIncidentStatus[status],
  icon: React.cloneElement(mapIncidentStatusIcon[status], {
    className: mapIncidentTwTextColor[status]
  })
}));

export const mapIncidentSortName: Record<IncidentSortBy, string> = {
  [IncidentSortBy.FIRST_SEEN]: "First seen",
  [IncidentSortBy.LAST_SEEN]: "Last seen",
  // [IncidentSortBy.ERRORS_COUNT]: "Errors count",
  [IncidentSortBy.STATUS]: "Status"
};

export const searchStatusOptions: SelectOptionProps[] = Object.values(IncidentStatusSearch).map(
  (status) => ({
    label: mapIncidentStatus[status],
    value: status
  })
);

export const sortOptions = Object.values(IncidentSortBy).map((sort) => ({
  label: mapIncidentSortName[sort],
  value: sort
}));

export const changeBarOptions = [
  {
    label: <BarChartOutlined />,
    value: "bar"
  },
  {
    label: <LineChartOutlined />,
    value: "line"
  }
];
