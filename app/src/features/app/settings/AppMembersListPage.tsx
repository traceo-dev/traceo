import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { SearchInput } from "../../../core/components/SearchInput";
import { ApiQueryParams } from "../../../core/lib/api";
import { dispatch } from "../../../store/store";
import { StoreState } from "../../../types/store";
import { MemberRole } from "../../../types/application";
import { loadMembers } from "./state/members/actions";
import { useParams } from "react-router-dom";
import { ConditionLayout } from "../../../core/components/ConditionLayout";
import { Permissions } from "../../../core/components/Permissions";
import AppSettingsNavigationPage from "./components/AppSettingsNavigation";
import { AddMemberModal } from "core/components/Modals/AddMemberModal";
import { DataNotFound } from "core/components/DataNotFound";
import { PagePanel } from "core/components/PagePanel";
import { SearchWrapper } from "core/components/SearchWrapper";
import { ApplicationMembersTable } from "core/components/Table/ApplicationMembersTable";

export const AppMembersListPage = () => {
  const { id } = useParams();
  const { members, hasFetched } = useSelector((state: StoreState) => state.members);

  const [search, setSearch] = useState<string>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

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

  const fetchMembers = () => {
    dispatch(loadMembers(queryParams));
  };

  // const handleLeave = async () => {
  //   const response: ApiResponse<string> = await api.delete("/api/amr/application/leave", {
  //     aid: account.id,
  //     appId: application.id
  //   });

  //   if (handleStatus(response.status) === "success") {
  //     navigate("/dashboard/overview");
  //     notify.success("App have been leaved successfully.");
  //   } else {
  //     notify.error(TRY_AGAIN_LATER_ERROR);
  //   }
  // };

  return (
    <>
      <AppSettingsNavigationPage>
        <PagePanel
          title="Members list"
          extra={
            <Permissions statuses={[MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER]}>
              <Button
                onClick={() => setModalOpen(true)}
                type="primary"
                icon={<PlusOutlined />}
              >
                Add
              </Button>
            </Permissions>
          }
        >
          <SearchWrapper className="pb-9">
            <SearchInput
              placeholder="Search by name or email"
              value={search}
              setValue={setSearch}
            />
          </SearchWrapper>
          <ConditionLayout
            isEmpty={members?.length === 0}
            isLoading={!hasFetched}
            emptyView={<DataNotFound label="Members not found" />}
          >
            <ApplicationMembersTable members={members} execute={fetchMembers} />
          </ConditionLayout>
        </PagePanel>
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
