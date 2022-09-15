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
