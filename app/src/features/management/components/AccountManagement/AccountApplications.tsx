import { useState } from "react";
import { useSelector } from "react-redux";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { useApi } from "../../../../core/lib/useApi";
import { MemberApplication } from "../../../../types/application";
import { StoreState } from "../../../../types/store";

import { AddToApplicationModal } from "../../../../core/components/Modals/AddToApplicationModal";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { ADMIN_EMAIL } from "../../../../core/utils/constants";
import { Button } from "core/ui-components/Button";
import { Card } from "core/ui-components/Card";
import { Space } from "core/ui-components/Space";
import { Table } from "core/ui-components/Table";
import { Avatar } from "core/ui-components/Avatar";
import { TableColumn } from "core/ui-components/Table/TableColumn";

export const AccountApplications = () => {
  const { account } = useSelector((state: StoreState) => state.serverAccounts);
  const [isOpenAddAppDrawer, setOpenAddAppDrawer] = useState<boolean>(false);

  const isAdmin = account.email === ADMIN_EMAIL;

  const {
    data: applications = [],
    execute: postExecute,
    isLoading
  } = useApi<MemberApplication[]>({
    url: "/api/amr/applications",
    params: {
      accountId: account.id
    }
  });

  return (
    <>
      <Card
        title="Applications list"
        extra={
          !isAdmin && (
            <Space className="w-full justify-end">
              <Button onClick={() => setOpenAddAppDrawer(true)}>
                Add user to application
              </Button>
            </Space>
          )
        }
      >
        <ConditionalWrapper
          emptyView={<DataNotFound label="No applications found" />}
          isEmpty={applications?.length === 0}
          isLoading={isLoading}
        >
          <Table collection={applications} striped>
            <TableColumn width={15}>
              {({ item }) => <Avatar size="sm" src={item?.gravatar} alt={item?.name} />}
            </TableColumn>
            <TableColumn name="Name" value="name" />
            <TableColumn name="Role" value="role" />
          </Table>
        </ConditionalWrapper>

        <AddToApplicationModal
          isOpen={isOpenAddAppDrawer}
          onCancel={() => setOpenAddAppDrawer(false)}
          postExecute={() => postExecute()}
        />
      </Card>
    </>
  );
};
