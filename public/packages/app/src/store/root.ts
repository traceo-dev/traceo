import applicationsReducer from "../features/admin/state/applications/reducers";
import accountsReducer from "../features/admin/state/users/reducers";
import logsReducer from "../features/app/explore/state/reducers";
import incidentsReducer from "../features/app/incidents/state/reducers";
import metricsReducer from "../features/app/metrics/state/reducers";
import membersReducer from "../features/app/settings/state/members/reducers";
import applicationReducer from "../features/app/state/application/reducers";
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
  ...applicationsReducer
};

export const appReducers = combineReducers({
  ...rootReducers,
  ...adminReducers
});

export const createRootReducer = () => {
  return (state: any, action: AnyAction) => appReducers(state, action);
};
