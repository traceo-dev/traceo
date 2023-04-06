import { useAppDispatch } from "../../store";
import { DashboardPageWrapper } from "./components/DashboardPageWrapper";
import { UserApplications } from "./components/UserManagement/UserApplications";
import { UserInformation } from "./components/UserManagement/UserInformation";
import { UserPermissions } from "./components/UserManagement/UserPermissions";
import { StoreState } from "@store/types";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadUser } from "./state/users/actions";

export const UserPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { isLoading } = useSelector((state: StoreState) => state.adminUser);

  useEffect(() => {
    dispatch(loadUser(id));
  }, []);

  return (
    <DashboardPageWrapper isLoading={isLoading}>
      <UserInformation />
      <UserPermissions />
      <UserApplications />
    </DashboardPageWrapper>
  );
};

export default UserPage;
