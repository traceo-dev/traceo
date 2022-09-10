import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { TraceoLoading } from "src/core/components/TraceoLoading";
import { useCleanup } from "src/core/hooks/useCleanup";
import { isEmptyObject } from "src/core/utils/object";
import { dispatch } from "src/store/store";
import { StoreState } from "src/types/store";
import { AccountApplications } from "./components/AccountManagement/AccountApplications";
import { AccountInformation } from "./components/AccountManagement/AccountInformation";
import { AccountPermissions } from "./components/AccountManagement/AccountPermissions";
import { ManagementNavigation } from "./components/ManagementNavigation";
import { loadServerAccount } from "./state/accounts/actions";

export const ManagementUserPage = () => {
  useCleanup((state: StoreState) => state.serverAccounts);

  const { id } = useParams();
  const { account } = useSelector((state: StoreState) => state.serverAccounts);

  useEffect(() => {
    dispatch(loadServerAccount(id));
  }, []);

  if (isEmptyObject(account)) return <TraceoLoading />;

  return (
    <ManagementNavigation>
      <AccountInformation />
      <AccountPermissions />
      <AccountApplications />
    </ManagementNavigation>
  );
};

export default ManagementUserPage;
