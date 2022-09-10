import { combineReducers, AnyAction } from "redux";

import applicationReducer from "src/features/app/state/reducers";
import incidentsReducer from "src/features/app/incidents/state/reducers";
import membersReducer from "src/features/app/members/state/reducers";
import accountReducer from "src/features/auth/state/reducers";
import serverAccounts from "src/features/management/state/reducers";
import dashboardReducer from "src/features/dashboard/state/reducers";

import { cleanUpAction, CleanUp } from "../hooks/useCleanup";

const rootReducers = {
  ...accountReducer,
  ...serverAccounts,
  ...incidentsReducer,
  ...membersReducer,
  ...applicationReducer,
  ...dashboardReducer
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
