import api, { ApiQueryParams } from "src/core/lib/api";
import { ThunkResult } from "src/types/store";
import { serverApplicationLoaded, serverApplicationsLoaded } from "./reducers";
import { Application } from "src/types/application";

export const loadServerApplications = (query?: ApiQueryParams): ThunkResult<void> => {
  return async (dispatch) => {
    const accounts = await api.get<Application[]>("/api/application/all", query);
    dispatch(serverApplicationsLoaded(accounts));
  };
};

export const loadServerApplication = (id: string): ThunkResult<void> => {
  return async (dispatch) => {
    const account = await api.get<Application>("/api/application", { id });
    dispatch(serverApplicationLoaded(account));
  }
}

// export const updateServerAccount = (update: Partial<Account>): ThunkResult<void> => {
//   return async (dispatch) => {
//     if (!update) {
//       return;
//     }

//     try {
//       await api.patch("/api/account", update);
//       dispatch(loadServerAccount(update.id));

//       notify.success("Account has been updated");
//     } catch (error) {
//       notify.error("Account has not been updated. Please try again later.");
//     }
//   };
// }

// export const addServerAccount = (props: AddAccountProps): ThunkResult<void> => {
//   return async (dispatch) => {
//     const response: ApiResponse<string> = await api.post("/api/account/new", props);

//     if (handleStatus(response.status) === "success") {
//       dispatch(loadServerAccounts());
//       notify.success("Added to Traceo.");
//     } else {
//       notify.error(response.message);
//     }
//   };
// };
