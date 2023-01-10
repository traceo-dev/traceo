import { Space } from "antd";
import { PagePanel } from "../../../../core/components/PagePanel";
import { ApplicationMembersTable } from "../../../../core/components/Table/ApplicationMembersTable";
import { useParams } from "react-router-dom";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { useApi } from "../../../../core/lib/useApi";
import { ApplicationMember } from "../../../../types/application";
import { Typography } from "core/ui-components/Typography/Typography";

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
        <ConditionalWrapper
          isEmpty={members?.length === 0}
          emptyView={
            <Space className="w-full justify-center">
              <Typography className="w-full justify-center">No members</Typography>
            </Space>
          }
          isLoading={isLoading}
        >
          <ApplicationMembersTable members={members} execute={postExecute} />
        </ConditionalWrapper>
      </PagePanel>
    </>
  );
};
