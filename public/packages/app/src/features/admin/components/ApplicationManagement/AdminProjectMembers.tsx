import { ProjectMembersTable } from "../../../../core/components/ProjectMembersTable";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { ProjectMember } from "@traceo/types";
import { Space, Typography, Card } from "@traceo/ui";
import { useParams } from "react-router-dom";
import { useReactQuery } from "../../../../core/hooks/useReactQuery";

export const AdminProjectMembers = () => {
  const { id } = useParams();

  const {
    data: members = [],
    isLoading,
    refetch
  } = useReactQuery<ProjectMember[]>({
    queryKey: ["members"],
    url: "/api/member/search",
    params: { id }
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
        <ProjectMembersTable collection={members} postExecute={() => refetch()} />
      </ConditionalWrapper>
    </Card>
  );
};
