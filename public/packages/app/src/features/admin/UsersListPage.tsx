import { SearchWrapper } from "../../core/components/SearchWrapper";
import { useAppDispatch } from "../../store";
import { DashboardPageWrapper } from "./components/DashboardPageWrapper";
import { UsersTable } from "./components/UserManagement/UsersTable";
import { loadUsers } from "./state/users/actions";
import { PlusOutlined } from "@ant-design/icons";
import { StoreState } from "@store/types";
import { InputSearch, Button, Card } from "@traceo/ui";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UsersListPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { users, hasFetched } = useSelector((state: StoreState) => state.users);
  const [search, setSearch] = useState<string>(null);

  useEffect(() => {
    dispatch(loadUsers({ search }));
  }, [search]);

  const onCreateNew = () => {
    navigate("/dashboard/user/new");
  };

  return (
    <DashboardPageWrapper>
      <Card
        title="Users list"
        extra={
          <Button onClick={() => onCreateNew()} icon={<PlusOutlined />}>
            New user
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
        <UsersTable users={users} hasFetched={hasFetched} />
      </Card>
    </DashboardPageWrapper>
  );
};

export default UsersListPage;
