import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ApiQueryParams } from "../../../core/lib/api";
import { dispatch } from "../../../store/store";
import { StoreState } from "../../../types/store";
import { MemberRole } from "../../../types/application";
import { loadMembers } from "./state/members/actions";
import { useParams } from "react-router-dom";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { Permissions } from "../../../core/components/Permissions";
import AppSettingsNavigationPage from "./components/AppSettingsNavigation";
import { AddMemberModal } from "../../../core/components/Modals/AddMemberModal";
import { DataNotFound } from "../../../core/components/DataNotFound";
import { InputSearch } from "core/ui-components/Input/InputSearch";
import { Button } from "core/ui-components/Button";
import { Card } from "core/ui-components/Card";
import { MemberTableRow } from "core/components/Table/rows/MemberTableRow";
import { useMemberRole } from "core/hooks/useMemberRole";
import { ADMIN_EMAIL } from "core/utils/constants";
import { Account } from "types/accounts";

export const AppMembersListPage = () => {
  const { id } = useParams();
  const { members, hasFetched } = useSelector((state: StoreState) => state.members);
  const { isAdmin, isMaintainer } = useMemberRole();

  const [search, setSearch] = useState<string>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const isEditable = (account: Account) =>
    (isAdmin || isMaintainer) && account.email === ADMIN_EMAIL;

  const queryParams: ApiQueryParams = {
    id,
    search
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [search]);

  const fetchMembers = () => dispatch(loadMembers(queryParams));

  return (
    <>
      <AppSettingsNavigationPage>
        <Card
          title="Collaborators"
          extra={
            <Permissions statuses={[MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER]}>
              <Button onClick={() => setModalOpen(true)} icon={<PlusOutlined />}>
                Add
              </Button>
            </Permissions>
          }
        >
          <InputSearch
            placeholder="Search by name or email"
            value={search}
            onChange={setSearch}
          />
          <ConditionalWrapper
            isEmpty={members?.length === 0}
            isLoading={!hasFetched}
            emptyView={<DataNotFound label="Members not found" />}
          >
            <table className="details-table mt-5">
              <thead className="details-table-thead">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {members?.map((member, key) => (
                  <MemberTableRow
                    key={key}
                    item={member}
                    editable={isEditable(member)}
                    postExecute={() => fetchMembers()}
                  />
                ))}
              </tbody>
            </table>
          </ConditionalWrapper>
        </Card>
      </AppSettingsNavigationPage>
      <AddMemberModal
        isOpen={isModalOpen}
        onCancel={() => {
          setModalOpen(false);
          fetchMembers();
        }}
      />
    </>
  );
};

export default AppMembersListPage;
