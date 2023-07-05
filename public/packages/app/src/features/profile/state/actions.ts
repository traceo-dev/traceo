import api from "../../../core/lib/api";
import { logout } from "../../../core/utils/logout";
import { loadSignedInUser } from "../../auth/state/actions";
import { ThunkResult } from "../../../store/types";
import { IUser, ApiResponse } from "@traceo/types";

export const updateUser = (update: Partial<IUser>): ThunkResult<void> => {
  return async (dispatch) => {
    if (!update) {
      return;
    }

    await api.patch<ApiResponse<unknown>>("/api/user", update);
    dispatch(loadSignedInUser());
  };
};

export const updateUserPassword = (cred: {
  password: string;
  newPassword: string;
}): ThunkResult<void> => {
  return async () => {
    if (!cred) {
      return;
    }

    await api.post<ApiResponse<string>>("/api/auth/update-password", cred).then((response) => {
      if (response.status === "success") {
        logout();
      }
    });
  };
};
