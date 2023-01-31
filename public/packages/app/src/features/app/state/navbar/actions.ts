import { ThunkResult } from "@store/types";
import { navbarState } from "./reducers";

export const toggleNavbar = (state: boolean): ThunkResult<void> => {
    return async (dispatch) => {
        dispatch(navbarState({
            hidden: state
        }));
    };
};
