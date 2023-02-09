import { PlusOutlined } from "@ant-design/icons";
import { SearchWrapper } from "../../core/components/SearchWrapper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store";
import { StoreState } from "@store/types";
import { AccountsTable } from "./components/AccountManagement/AccountsTable";
import { DashboardPageWrapper } from "./components/DashboardPageWrapper";
import { loadServerAccounts } from "./state/accounts/actions";
import { InputSearch, Button, Card } from "@traceo/ui";
import { useNavigate } from "react-router-dom";

const UsersListPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { accounts, hasFetched } = useSelector(
    (state: StoreState) => state.serverAccounts
  );
  const [search, setSearch] = useState<string>(null);

  useEffect(() => {
    dispatch(loadServerAccounts({ search }));
  }, [search]);

  const onCreateNew = () => {
    navigate("/dashboard/account/new");
  };

  return (
    <DashboardPageWrapper>
      <Card
        title="Accounts list"
        extra={
          <Button onClick={() => onCreateNew()} icon={<PlusOutlined />}>
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
    </DashboardPageWrapper>
  );
};

export default UsersListPage;
