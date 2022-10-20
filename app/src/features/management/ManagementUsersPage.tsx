import { PlusOutlined } from "@ant-design/icons";
import { Space, Button, Input } from "antd";
import { PagePanel } from "core/components/PagePanel";
import { SearchWrapper } from "core/components/SearchWrapper";
import { TraceoInput } from "core/components/TraceoInput";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NewAccountModal } from "../../core/components/Modals/NewAccountModal";
import { SearchInput } from "../../core/components/SearchInput";
import { ApiQueryParams } from "../../core/lib/api";
import { dispatch } from "../../store/store";
import { StoreState } from "../../types/store";
import { AccountsTable } from "./components/AccountManagement/AccountsTable";
import { ManagementNavigation } from "./components/ManagementNavigation";
import { loadServerAccounts } from "./state/accounts/actions";

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

  const fetchAccounts = () => dispatch(loadServerAccounts(queryParams));

  return (
    <ManagementNavigation>
      <PagePanel
        title="Accounts list"
        extra={
          <Button
            onClick={() => setOpenNewAccountDrawer(true)}
            type="primary"
            icon={<PlusOutlined />}
          >
            New account
          </Button>
        }
      >
        <SearchWrapper className="pb-5">
          <SearchInput
            placeholder="Search user by username, name or email"
            value={search}
            setValue={setSearch}
          />
        </SearchWrapper>
        <AccountsTable accounts={accounts} hasFetched={hasFetched} />
      </PagePanel>
      <NewAccountModal
        isOpen={isOpenNewAccountDrawer}
        onCancel={() => setOpenNewAccountDrawer(false)}
      />
    </ManagementNavigation>
  );
};

export default ManagementUsersPage;