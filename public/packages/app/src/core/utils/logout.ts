import { logoutUser } from "../../features/auth/state/actions";
import { store } from "../../store";

export const logout = () => {
  store.dispatch(logoutUser());
};
