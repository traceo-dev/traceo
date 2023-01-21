import { CloseOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons";
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
import { useMemberRole } from "core/hooks/useMemberRole";
import { ADMIN_EMAIL } from "core/utils/constants";
import { Account } from "types/accounts";
import { Table } from "core/ui-components/Table";
import { Avatar } from "core/ui-components/Avatar";
import { ButtonContainer } from "core/ui-components/Button/ButtonContainer";
import { RadioButtonGroup } from "core/ui-components/RadioButton/RadioButtonGroup";
import { Select } from "core/ui-components/Select";
import { TableColumn } from "core/ui-components/Table/TableColumn";

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

  const [changeRoleMode, setChangeRoleMode] = useState<boolean>(false);
  const [removeFromAppMode, setRemoveFromAppMode] = useState<boolean>(false);

  const options = [
    { label: "Administrator", value: MemberRole.ADMINISTRATOR },
    { label: "Maintainer", value: MemberRole.MAINTAINER },
    { label: "Viewer", value: MemberRole.VIEWER }
  ];

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
            <Table className="mt-5" collection={members} striped>
              <TableColumn width={5}>
                {({ item }) => <Avatar size="sm" src={item?.gravatar} alt={item?.name} />}
              </TableColumn>
              <TableColumn name="Name" value="name" />
              <TableColumn name="Email" value="email" />
              <TableColumn name="Role" value="role" />
              {/* <TableColumn width={15}>{() => <SettingOutlined />}</TableColumn> */}
            </Table>
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
