import { combineReducers, AnyAction } from "redux";

import applicationReducer from "../../features/app/state/reducers";
import incidentsReducer from "../../features/app/incidents/state/reducers";
import membersReducer from "../../features/app/settings/state/members/reducers";
import logsReducer from "../../features/app/explore/logs/state/reducers";
import accountReducer from "../../features/auth/state/reducers";
import serverAccountsReducer from "../../features/management/state/accounts/reducers";
import serverApplicationsReducer from "../../features/management/state/applications/reducers";
import dashboardReducer from "../../features/dashboard/state/reducers";

import { cleanUpAction, CleanUp } from "../hooks/useCleanup";

const rootReducers = {
  ...accountReducer,
  ...serverAccountsReducer,
  ...serverApplicationsReducer,
  ...incidentsReducer,
  ...membersReducer,
  ...applicationReducer,
  ...dashboardReducer,
  ...logsReducer
};

const addedReducers = {};

export const createRootReducer = () => {
  const appReducer = combineReducers({
    ...rootReducers,
    ...addedReducers
  });

  return (state: any, action: AnyAction) => {
    if (action.type !== cleanUpAction.type) {
      return appReducer(state, action);
    }

    const { stateSelector } = action.payload as CleanUp<any>;
    const stateSlice = stateSelector(state);
    recursiveCleanState(state, stateSlice);

    return appReducer(state, action);
  };
};

export const recursiveCleanState = (state: any, stateSlice: any): boolean => {
  for (const stateKey in state) {
    if (!state.hasOwnProperty(stateKey)) {
      continue;
    }

    const slice = state[stateKey];
    if (slice === stateSlice) {
      state[stateKey] = undefined;
      return true;
    }

    if (typeof slice === "object") {
      const cleaned = recursiveCleanState(slice, stateSlice);
      if (cleaned) {
        return true;
      }
    }
  }

  return false;
};
