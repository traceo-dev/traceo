import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Descriptions, Space, Typography } from "antd";
import DescriptionsItem from "antd/lib/descriptions/Item";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RowDetail } from "src/core/components/RowDetail";
import { TraceoLoading } from "src/core/components/TraceoLoading";
import { useCleanup } from "src/core/hooks/useCleanup";
import { useApi } from "src/core/lib/useApi";
import { isEmptyObject } from "src/core/utils/object";
import { dispatch } from "src/store/store";
import { Account } from "src/types/accounts";
import { StoreState } from "src/types/store";
import { AccountApplications } from "./components/AccountApplications";
import { AccountInformation } from "./components/AccountInformation";
import { AccountPermissions } from "./components/AccountPermissions";
import { ManagementNavigation } from "./components/ManagementNavigation";
import { loadServerAccount } from "./state/actions";

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
