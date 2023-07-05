import { navbarHideState } from "./reducers";
import { ThunkResult } from "../../types";

export const hideNavbar = (hidden: boolean): ThunkResult<void> => {
  return async (dispatch) => {
    dispatch(navbarHideState({ hidden }));
  };
};
