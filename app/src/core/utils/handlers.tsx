export enum ReleaseSortBy {
  INCIDENTS_COUNT = "incidentsCount",
  INCIDENTS_OCCUR_COUNT = "incidentsOccurCount",
  CREATED_AT = "createdAt",
  LAST_DEPLOYMENT_AT = "lastDeploymentAt"
}

export enum AppsSortBy {
  LAST_UPDATE = "application.updatedAt",
  CREATED_AT = "application.createdAt",
  LAST_INCIDENT = "application.lastIncidentAt"
}

export const handleAppSort: Record<AppsSortBy, string> = {
  [AppsSortBy.CREATED_AT]: "Created at",
  [AppsSortBy.LAST_UPDATE]: "Last update",
  [AppsSortBy.LAST_INCIDENT]: "Last incident"
};

export const handleReleaseSort: Record<ReleaseSortBy, string> = {
  [ReleaseSortBy.LAST_DEPLOYMENT_AT]: "Last deployment",
  [ReleaseSortBy.CREATED_AT]: "Created",
  [ReleaseSortBy.INCIDENTS_COUNT]: "Incidents count",
  [ReleaseSortBy.INCIDENTS_OCCUR_COUNT]: "Incidents occur count"
};
