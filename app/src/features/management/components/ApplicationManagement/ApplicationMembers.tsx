import { Space } from "core/ui-components/Space";
import { useParams } from "react-router-dom";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { useApi } from "../../../../core/lib/useApi";
import { ApplicationMember } from "../../../../types/application";
import { Typography } from "core/ui-components/Typography";
import { Card } from "core/ui-components/Card";
import { Table } from "core/ui-components/Table";
import { Avatar } from "core/ui-components/Avatar";
import dateUtils from "core/utils/date";
import { TableColumn } from "core/ui-components/Table/TableColumn";

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
          <Table collection={members} striped>
            <TableColumn width={15}>
              {({ item }) => <Avatar size="sm" src={item?.gravatar} alt={item?.name} />}
            </TableColumn>
            <TableColumn name="Name" value="name" />
            <TableColumn name="Email" value="email" />
            <TableColumn name="Role" value="role" />
            <TableColumn name="Invited">
              {({ item }) => dateUtils.fromNow(item.createdAt)}
            </TableColumn>
          </Table>
        </ConditionalWrapper>
      </Card>
    </>
  );
};
