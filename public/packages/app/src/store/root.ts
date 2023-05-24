import adminUserReducer from "../features/admin/state/users/reducers";
import adminProjectReducer from "../features/admin/state/projects/reducers";

import commentsReducer from "../features/project/incidents/state/slices/comments.slice";
import incidentReducer from "../features/project/incidents/state/slices/incident.slice";
import groupedEventsReducer from "../features/project/incidents/state/slices/grouped-events.slice";

import alertsSlice from "../features/project/alerting/state/alert.slice";
import membersReducer from "../features/project/settings/state/members/reducers";
import applicationReducer from "../features/project/state/project/reducers";
import userReducer from "../features/auth/state/reducers";
import navbarReducer from "./internal/navbar/reducers";
import notifyReducer from "./internal/notify/notifyReducer";

import { combineReducers, AnyAction } from "redux";

const incidentReducers = {
  ...commentsReducer,
  ...incidentReducer,
  ...groupedEventsReducer
};

const adminReducers = {
  ...adminUserReducer,
  ...adminProjectReducer
};

const rootReducers = {
  ...userReducer,
  ...membersReducer,
  ...alertsSlice,
  ...applicationReducer,
  ...navbarReducer,
  ...notifyReducer,
  ...incidentReducers
};

export const appReducers = combineReducers({
  ...rootReducers,
  ...adminReducers
});

export const createRootReducer = () => {
  return (state: any, action: AnyAction) => appReducers(state, action);
};
