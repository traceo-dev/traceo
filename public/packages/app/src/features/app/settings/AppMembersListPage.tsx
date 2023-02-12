import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ApiQueryParams } from "../../../core/lib/api";
import { useAppDispatch } from "../../../store";
import { StoreState } from "@store/types";
import { MemberRole } from "@traceo/types";
import { loadMembers } from "./state/members/actions";
import { useParams } from "react-router-dom";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { Permissions } from "../../../core/components/Permissions";
import SettingsPageWrapper from "./components/SettingsPageWrapper";
import { AddMemberModal } from "../../../core/components/Modals/AddMemberModal";
import { DataNotFound } from "../../../core/components/DataNotFound";
import { InputSearch, Button, Card } from "@traceo/ui";
import { ApplicationMembersTable } from "../../../core/components/ApplicationMembersTable";

export const AppMembersListPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { members, hasFetched } = useSelector((state: StoreState) => state.members);

  const [search, setSearch] = useState<string>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const queryParams: ApiQueryParams = {
    id,
    search
  };

  useEffect(() => {
    dispatch(loadMembers(queryParams));
  }, [search]);

  console.log("mem: ", members?.length);

  return (
    <>
      <SettingsPageWrapper>
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
            <ApplicationMembersTable
              className="mt-5"
              collection={members}
              postExecute={() => dispatch(loadMembers(queryParams))}
            />
          </ConditionalWrapper>
        </Card>
      </SettingsPageWrapper>
      <AddMemberModal
        isOpen={isModalOpen}
        onCancel={() => {
          setModalOpen(false);
          dispatch(loadMembers(queryParams));
        }}
      />
    </>
  );
};

export default AppMembersListPage;
