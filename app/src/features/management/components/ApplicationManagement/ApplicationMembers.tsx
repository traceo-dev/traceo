import { Space, Typography, Card } from "@traceo/ui";
import { useParams } from "react-router-dom";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { useRequest } from "../../../../core/hooks/useRequest";
import { ApplicationMember } from "../../../../types/application";
import { ApplicationMembersTable } from "../../../../core/components/ApplicationMembersTable";

export const ApplicationMembers = () => {
  const { id } = useParams();

  const {
    data: members = [],
    isLoading,
    execute
  } = useRequest<ApplicationMember[]>({
    url: "/api/amr/members",
    params: {
      id
    }
  });

  return (
    <Card title="Application members">
      <ConditionalWrapper
        isEmpty={members?.length === 0}
        emptyView={
          <Space className="w-full justify-center">
            <Typography className="w-full justify-center">No members</Typography>
          </Space>
        }
        isLoading={isLoading}
      >
        <ApplicationMembersTable collection={members} postExecute={() => execute()} />
      </ConditionalWrapper>
    </Card>
  );
};
