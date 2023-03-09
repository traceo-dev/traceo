import { navbarHideState } from "./reducers";
import { ThunkResult } from "@store/types";

export const hideNavbar = (hidden: boolean): ThunkResult<void> => {
  return async (dispatch) => {
    dispatch(navbarHideState({ hidden }));
  };
};
