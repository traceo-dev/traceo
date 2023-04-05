import projectsReducer from "../features/admin/state/projects/reducers";
import accountsReducer from "../features/admin/state/users/reducers";
import logsReducer from "../features/project/explore/state/reducers";

import commentsReducer from "../features/project/incidents/state/slices/comments.slice";
import incidentReducer from "../features/project/incidents/state/slices/incident.slice";
import incidentsReducer from "../features/project/incidents/state/slices/incidents.slice";
import eventsReducer from "../features/project/incidents/state/slices/events.slice";
import groupedEventsReducer from "../features/project/incidents/state/slices/grouped-events.slice";

import metricsReducer from "../features/project/metrics/state/reducers";
import membersReducer from "../features/project/settings/state/members/reducers";
import applicationReducer from "../features/project/state/project/reducers";
import userReducer from "../features/auth/state/reducers";
import dashboardReducer from "../features/dashboard/state/reducers";
import navbarReducer from "./internal/navbar/reducers";
import notifyReducer from "./internal/notify/notifyReducer";
import { combineReducers, AnyAction } from "redux";

const incidentReducers = {
  ...commentsReducer,
  ...incidentReducer,
  ...incidentsReducer,
  ...eventsReducer,
  ...groupedEventsReducer
}
const rootReducers = {
  ...userReducer,
  ...membersReducer,
  ...applicationReducer,
  ...dashboardReducer,
  ...logsReducer,
  ...navbarReducer,
  ...metricsReducer,
  ...notifyReducer,
  ...incidentReducers
};

const adminReducers = {
  ...accountsReducer,
  ...projectsReducer
};

export const appReducers = combineReducers({
  ...rootReducers,
  ...adminReducers
});

export const createRootReducer = () => {
  return (state: any, action: AnyAction) => appReducers(state, action);
};
