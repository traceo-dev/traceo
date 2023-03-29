import projectsReducer from "../features/admin/state/projects/reducers";
import accountsReducer from "../features/admin/state/users/reducers";
import logsReducer from "../features/project/explore/state/reducers";
import incidentsReducer from "../features/project/incidents/state/reducers";
import metricsReducer from "../features/project/metrics/state/reducers";
import membersReducer from "../features/project/settings/state/members/reducers";
import applicationReducer from "../features/project/state/project/reducers";
import userReducer from "../features/auth/state/reducers";
import dashboardReducer from "../features/dashboard/state/reducers";
import navbarReducer from "./internal/navbar/reducers";
import notifyReducer from "./internal/notify/notifyReducer";
import { combineReducers, AnyAction } from "redux";

const rootReducers = {
  ...userReducer,
  ...incidentsReducer,
  ...membersReducer,
  ...applicationReducer,
  ...dashboardReducer,
  ...logsReducer,
  ...navbarReducer,
  ...metricsReducer,
  ...notifyReducer
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
