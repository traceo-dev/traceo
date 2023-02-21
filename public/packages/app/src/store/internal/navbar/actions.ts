import { navbarState } from "./reducers";
import { ThunkResult } from "@store/types";

export const toggleNavbar = (state: boolean): ThunkResult<void> => {
  return async (dispatch) => {
    dispatch(
      navbarState({
        hidden: state
      })
    );
  };
};
