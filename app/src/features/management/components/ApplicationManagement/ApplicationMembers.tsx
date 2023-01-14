import { Space } from "core/ui-components/Space";
import { useParams } from "react-router-dom";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { useApi } from "../../../../core/lib/useApi";
import { ApplicationMember } from "../../../../types/application";
import { Typography } from "core/ui-components/Typography";
import { Card } from "core/ui-components/Card";
import { MemberTableRow } from "core/components/Table/rows/MemberTableRow";

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
          <table className="details-table">
            <thead className="details-table-thead">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {members?.map((member, key) => (
                <MemberTableRow key={key} item={member} postExecute={postExecute} />
              ))}
            </tbody>
          </table>
        </ConditionalWrapper>
      </Card>
    </>
  );
};
