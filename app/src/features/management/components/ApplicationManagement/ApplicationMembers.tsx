import { Space, Typography } from "antd";
import { PagePanel } from "../../../../core/components/PagePanel";
import { ApplicationMembersTable } from "../../../../core/components/Table/ApplicationMembersTable";
import { useParams } from "react-router-dom";
import { ConditionLayout } from "../../../../core/components/ConditionLayout";
import { useApi } from "../../../../core/lib/useApi";
import { ApplicationMember } from "../../../../types/application";

export const ApplicationMembers = () => {
  const { id } = useParams();

  const {
    data: members = [],
    isLoading,
    execute: postExecute
  } = useApi<ApplicationMember[]>({
    url: "/api/amr/members",
    params: {
      id
    }
  });
  return (
    <>
      <PagePanel title="Application members">
        <ConditionLayout
          isEmpty={members?.length === 0}
          emptyView={
            <Space className="w-full justify-center">
              <Typography.Text className="w-full justify-center">
                No members
              </Typography.Text>
            </Space>
          }
          isLoading={isLoading}
        >
          <ApplicationMembersTable members={members} execute={postExecute} />
        </ConditionLayout>
      </PagePanel>
    </>
  );
};
