import { ProjectMembersTable } from "../../../../core/components/ProjectMembersTable";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { useRequest } from "../../../../core/hooks/useRequest";
import { ProjectMember } from "@traceo/types";
import { Space, Typography, Card } from "@traceo/ui";
import { useParams } from "react-router-dom";

export const AdminProjectMembers = () => {
  const { id } = useParams();

  const {
    data: members = [],
    isLoading,
    execute
  } = useRequest<ProjectMember[]>({
    url: "/api/member/search",
    params: {
      id
    }
  });

  return (
    <Card title="project members">
      <ConditionalWrapper
        isEmpty={members?.length === 0}
        emptyView={
          <Space className="w-full justify-center">
            <Typography className="w-full justify-center">No members</Typography>
          </Space>
        }
        isLoading={isLoading}
      >
        <ProjectMembersTable collection={members} postExecute={() => execute()} />
      </ConditionalWrapper>
    </Card>
  );
};
