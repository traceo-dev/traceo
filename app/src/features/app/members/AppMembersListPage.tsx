import { PlusOutlined, TeamOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AddMemberDrawer } from "src/core/components/Drawers/AddMemberDrawer";
import AppPage from "src/core/components/Layout/Pages/AppPage";
import { SearchInput } from "src/core/components/SearchInput";
import { MembersTable } from "src/features/app/members/components/MembersTable";
import api, { ApiQueryParams } from "src/core/lib/api";
import { notify } from "src/core/utils/notify";
import { handleStatus } from "src/core/utils/response";
import { dispatch } from "src/store/store";
import { ApiResponse } from "src/types/api";
import { StoreState } from "src/types/store";
import { MemberRole } from "src/types/application";
import { loadMembers } from "src/features/app/members/state/actions";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "src/core/components/PageHeader";
import { PagePanel } from "src/core/components/PagePanel";
import { Confirm } from "src/core/components/Confirm";
import { ConditionLayout } from "src/core/components/ConditionLayout";
import { EmptyMembersList } from "src/core/components/EmptyViews/EmptyMembersList";
import Permissions from "src/core/components/Permissions";

export const AppMembersListPage = () => {
  const { id } = useParams();
  const { account } = useSelector((state: StoreState) => state.account);
  const { members, hasFetched } = useSelector((state: StoreState) => state.members);
  const { application } = useSelector((state: StoreState) => state.application);

  const [search, setSearch] = useState<string>(null);
  const [isOpenAddMemberDrawer, setOpenAddMemberDrawer] = useState<boolean>(false);

  const navigate = useNavigate();

  // const isLeaveButton = !account?.status || account?.status === MEMBER_STATUS.OWNER;
  // const isLeaveButton = false;

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

  const handleLeave = async () => {
    const response: ApiResponse<string> = await api.delete("/api/amr/application/leave", {
      aid: account.id,
      appId: application.id
    });

    if (handleStatus(response.status) === "success") {
      navigate("/dashboard/overview");
      notify.success("App have been leaved successfully.");
    } else {
      notify.error("Cannot leave this app. Please try again later.");
    }
  };

  return (
    <>
      <AppPage>
        <PageHeader
          title="Members"
          icon={<TeamOutlined />}
          extra={
            <Permissions
              statuses={[MemberRole.MAINTAINER, MemberRole.ADMINISTRATOR]}
            >
              <Confirm
                onOk={() => handleLeave()}
                withAuth={true}
                description="Are you sure that you want to leave this app?"
              >
                <Button type="primary" danger>
                  Leave this app
                </Button>
              </Confirm>
            </Permissions>
          }
          subTitle="Manage your team members and their account permissions here."
        />
        <PagePanel>
          <Space className="w-full pb-2 justify-between">
            <SearchInput
              placeholder="Search"
              value={search}
              setValue={setSearch}
              get={fetchMembers}
            />
            <Permissions statuses={[MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER]}>
              <Button
                onClick={() => setOpenAddMemberDrawer(true)}
                type="primary"
                icon={<PlusOutlined />}
              >
                Add member
              </Button>
            </Permissions>
          </Space>
          <ConditionLayout
            isEmpty={members?.length === 0}
            isLoading={!hasFetched}
            emptyView={<EmptyMembersList constraints={search} />}
          >
            <MembersTable members={members} hasFetched={hasFetched} />
          </ConditionLayout>
        </PagePanel>
      </AppPage>
      <AddMemberDrawer
        isOpen={isOpenAddMemberDrawer}
        onCancel={() => setOpenAddMemberDrawer(false)}
      />
    </>
  );
};

export default AppMembersListPage;
