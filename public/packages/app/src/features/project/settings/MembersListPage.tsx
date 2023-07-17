import { ProjectMembersTable } from "../../../core/components/ProjectMembersTable";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../core/components/DataNotFound";
import { AddMemberModal } from "../../../core/components/Modals/AddMemberModal";
import { Permissions } from "../../../core/components/Permissions";
import { ApiQueryParams } from "../../../core/lib/api";
import { useAppDispatch } from "../../../store";
import SettingsPageWrapper from "./components/SettingsPageWrapper";
import { loadMembers } from "./state/members/actions";
import { PlusOutlined } from "@ant-design/icons";
import { StoreState } from "../../../store/types";
import { MemberRole } from "@traceo/types";
import { InputSearch, Button, Card } from "@traceo/ui";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export const MembersListPage = () => {
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
            <ProjectMembersTable
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

export default MembersListPage;
