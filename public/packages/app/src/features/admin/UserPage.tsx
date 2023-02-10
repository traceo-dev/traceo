import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../store";
import { StoreState } from "@store/types";
import { UserApplications } from "./components/UserManagement/UserApplications";
import { UserInformation } from "./components/UserManagement/UserInformation";
import { UserPermissions } from "./components/UserManagement/UserPermissions";
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
      <UserInformation />
      <UserPermissions />
      <UserApplications />
    </DashboardPageWrapper>
  );
};

export default UserPage;
