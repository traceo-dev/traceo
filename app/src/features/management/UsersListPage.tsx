import { PlusOutlined } from "@ant-design/icons";
import { SearchWrapper } from "../../core/components/SearchWrapper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NewAccountModal } from "../../core/components/Modals/NewAccountModal";
import { useAppDispatch } from "../../store";
import { StoreState } from "../../types/store";
import { AccountsTable } from "./components/AccountManagement/AccountsTable";
import { DashboardPageWrapper } from "./components/DashboardPageWrapper";
import { loadServerAccounts } from "./state/accounts/actions";
import { InputSearch } from "../../core/ui-components/Input/InputSearch";
import { Button } from "../../core/ui-components/Button";
import { Card } from "../../core/ui-components/Card";

const UsersListPage = () => {
  const dispatch = useAppDispatch();

  const { accounts, hasFetched } = useSelector(
    (state: StoreState) => state.serverAccounts
  );
  const [search, setSearch] = useState<string>(null);
  const [isOpenNewAccountDrawer, setOpenNewAccountDrawer] = useState<boolean>(false);

  useEffect(() => {
    dispatch(loadServerAccounts({ search }));
  }, [search]);

  return (
    <DashboardPageWrapper>
      <Card
        title="Accounts list"
        extra={
          <Button onClick={() => setOpenNewAccountDrawer(true)} icon={<PlusOutlined />}>
            New account
          </Button>
        }
      >
        <SearchWrapper className="pb-5">
          <InputSearch
            placeholder="Search user by username, name or email"
            value={search}
            onChange={setSearch}
          />
        </SearchWrapper>
        <AccountsTable accounts={accounts} hasFetched={hasFetched} />
      </Card>
      <NewAccountModal
        isOpen={isOpenNewAccountDrawer}
        onCancel={() => setOpenNewAccountDrawer(false)}
      />
    </DashboardPageWrapper>
  );
};

export default UsersListPage;
