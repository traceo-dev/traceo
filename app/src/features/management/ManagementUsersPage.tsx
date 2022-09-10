import { PlusOutlined } from "@ant-design/icons";
import { Space, Button } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NewAccountDrawer } from "src/core/components/Drawers/NewAccountDrawer";
import { SearchInput } from "src/core/components/SearchInput";
import { ApiQueryParams } from "src/core/lib/api";
import { dispatch } from "src/store/store";
import { StoreState } from "src/types/store";
import { AccountsTable } from "./components/AccountsTable";
import { ManagementNavigation } from "./components/ManagementNavigation";
import { loadServerAccounts } from "./state/actions";

const ManagementUsersPage = () => {
  const { accounts, hasFetched } = useSelector(
    (state: StoreState) => state.serverAccounts
  );
  const [search, setSearch] = useState<string>(null);
  const [isOpenNewAccountDrawer, setOpenNewAccountDrawer] = useState<boolean>(false);

  const queryParams: ApiQueryParams = { search };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [search]);

  const fetchAccounts = () => {
    dispatch(loadServerAccounts(queryParams));
  };

  return (
    <ManagementNavigation>
      <Space className="w-full pb-2 justify-between">
        <SearchInput
          placeholder="Search"
          value={search}
          setValue={setSearch}
          get={fetchAccounts}
        />
        <Button
          onClick={() => setOpenNewAccountDrawer(true)}
          type="primary"
          icon={<PlusOutlined />}
        >
          New account
        </Button>
      </Space>
      <AccountsTable accounts={accounts} hasFetched={hasFetched} />
      <NewAccountDrawer
        isOpen={isOpenNewAccountDrawer}
        onCancel={() => setOpenNewAccountDrawer(false)}
      />
    </ManagementNavigation>
  );
};

export default ManagementUsersPage;
