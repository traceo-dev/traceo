import { logoutAccount } from "../../features/auth/state/actions";
import { store } from "../../store";

export const logout = () => {
  store.dispatch(logoutAccount());
};
