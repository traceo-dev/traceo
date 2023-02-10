import { combineReducers, AnyAction } from "redux";

import applicationReducer from "../features/app/state/application/reducers";
import navbarReducer from "./internal/navbar/reducers";
import incidentsReducer from "../features/app/incidents/state/reducers";
import membersReducer from "../features/app/settings/state/members/reducers";
import logsReducer from "../features/app/explore/state/reducers";
import userReducer from "../features/auth/state/reducers";
import serverAccountsReducer from "../features/admin/state/users/reducers";
import serverApplicationsReducer from "../features/admin/state/applications/reducers";
import dashboardReducer from "../features/dashboard/state/reducers";
import metricsReducer from "../features/app/metrics/state/reducers"
import notifyReducer from "./internal/notify/notifyReducer";

const rootReducers = {
  ...userReducer,
  ...serverAccountsReducer,
  ...serverApplicationsReducer,
  ...incidentsReducer,
  ...membersReducer,
  ...applicationReducer,
  ...dashboardReducer,
  ...logsReducer,
  ...navbarReducer,
  ...metricsReducer,
  ...notifyReducer
};

const addedReducers = {};

export const appReducers = combineReducers({
  ...rootReducers,
  ...addedReducers
});

export const createRootReducer = () => {
  return (state: any, action: AnyAction) => appReducers(state, action);
};
