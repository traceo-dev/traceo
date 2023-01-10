import { Space } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { useApi } from "../../../../core/lib/useApi";
import { ApplicationMember } from "../../../../types/application";
import { StoreState } from "../../../../types/store";

import { AddToApplicationModal } from "../../../../core/components/Modals/AddToApplicationModal";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { ADMIN_EMAIL } from "../../../../core/utils/constants";
import { TraceoTable } from "../../../../core/components/Table/TraceoTable";
import { MemberTableRow } from "../../../../core/components/Table/rows/MemberTableRow";
import { Button } from "core/ui-components/Button/Button";
import { Card } from "core/ui-components/Card/Card";

export const AccountApplications = () => {
  const { account } = useSelector((state: StoreState) => state.serverAccounts);
  const [isOpenAddAppDrawer, setOpenAddAppDrawer] = useState<boolean>(false);

  const isAdmin = account.email === ADMIN_EMAIL;

  const {
    data: applications = [],
    execute: postExecute,
    isLoading
  } = useApi<ApplicationMember[]>({
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
          <TraceoTable columns={["Name", "Role"]}>
            {applications?.map((member, index) => (
              <MemberTableRow
                key={index}
                item={member}
                postExecute={postExecute}
                editable={!isAdmin}
                type="application"
              />
            ))}
          </TraceoTable>
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
