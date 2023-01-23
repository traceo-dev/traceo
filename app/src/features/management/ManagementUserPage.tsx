import { PageContentLoading } from "core/components/PageContentLoading";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../store";
import { StoreState } from "../../types/store";
import { AccountApplications } from "./components/AccountManagement/AccountApplications";
import { AccountInformation } from "./components/AccountManagement/AccountInformation";
import { AccountPermissions } from "./components/AccountManagement/AccountPermissions";
import { ManagementNavigation } from "./components/ManagementNavigation";
import { loadServerAccount } from "./state/accounts/actions";

export const ManagementUserPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { hasFetched } = useSelector((state: StoreState) => state.serverAccounts);

  useEffect(() => {
    dispatch(loadServerAccount(id));
  }, []);

  return (
    <ManagementNavigation>
      <PageContentLoading isLoading={!hasFetched}>
        <AccountInformation />
        <AccountPermissions />
        <AccountApplications />
      </PageContentLoading>
    </ManagementNavigation>
  );
};

export default ManagementUserPage;
