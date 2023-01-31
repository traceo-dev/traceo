import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../store";
import { StoreState } from "../../store/types";
import { AccountApplications } from "./components/AccountManagement/AccountApplications";
import { AccountInformation } from "./components/AccountManagement/AccountInformation";
import { AccountPermissions } from "./components/AccountManagement/AccountPermissions";
import { DashboardPageWrapper } from "./components/DashboardPageWrapper";
import { loadServerAccount } from "./state/accounts/actions";

export const UserPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { hasFetched } = useSelector((state: StoreState) => state.serverAccounts);

  useEffect(() => {
    dispatch(loadServerAccount(id));
  }, []);

  return (
    <DashboardPageWrapper isLoading={!hasFetched}>
      <AccountInformation />
      <AccountPermissions />
      <AccountApplications />
    </DashboardPageWrapper>
  );
};

export default UserPage;
