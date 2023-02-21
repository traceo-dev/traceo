import { useAppDispatch } from "../../store";
import { DashboardPageWrapper } from "./components/DashboardPageWrapper";
import { UserApplications } from "./components/UserManagement/UserApplications";
import { UserInformation } from "./components/UserManagement/UserInformation";
import { UserPermissions } from "./components/UserManagement/UserPermissions";
import { loadUser } from "./state/users/actions";
import { StoreState } from "@store/types";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export const UserPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { hasFetched } = useSelector((state: StoreState) => state.users);

  useEffect(() => {
    dispatch(loadUser(id));
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
