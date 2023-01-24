import { useEffect } from "react";
import { loadAccount } from "../../auth/state/actions";
import { useAppDispatch } from "../../../store";
import { toggleNavbar } from "../../../features/app/state/navbar/actions";
import { resetApplicationState } from "features/app/state/application/reducers";

export const DashboardWrapper = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetApplicationState());
    dispatch(toggleNavbar(false));
    dispatch(loadAccount());
  }, []);

  return <div className="pb-5 pt-12">{children}</div>;
};
