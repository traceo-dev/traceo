import { SearchWrapper } from "../../core/components/SearchWrapper";
import { DashboardPageWrapper } from "./components/DashboardPageWrapper";
import { UsersTable } from "./components/UserManagement/UsersTable";
import { PlusOutlined } from "@ant-design/icons";
import { InputSearch, Button, Card } from "@traceo/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IUser } from "@traceo/types";
import { useReactQuery } from "../../core/hooks/useReactQuery";

const UsersListPage = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>(null);

  const {
    data: users = [],
    isLoading,
    isRefetching
  } = useReactQuery<IUser[]>({
    queryKey: ["users", search],
    url: "/api/users/search",
    params: { search }
  });

  const onCreateNew = () => {
    navigate("/dashboard/new-user");
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
            loading={isRefetching}
          />
        </SearchWrapper>
        <UsersTable users={users} isLoading={isLoading} />
      </Card>
    </DashboardPageWrapper>
  );
};

export default UsersListPage;
