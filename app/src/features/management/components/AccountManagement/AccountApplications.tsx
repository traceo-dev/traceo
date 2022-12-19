import { Space, Button } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { useApi } from "../../../../core/lib/useApi";
import { ApplicationMember } from "../../../../types/application";
import { StoreState } from "../../../../types/store";

import { AddToApplicationModal } from "../../../../core/components/Modals/AddToApplicationModal";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { PagePanel } from "../../../../core/components/PagePanel";
import { ADMIN_EMAIL } from "../../../../core/utils/constants";
import { TraceoTable } from "../../../../core/components/Table/TraceoTable";
import { MemberTableRow } from "../../../../core/components/Table/rows/MemberTableRow";

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
      <PagePanel
        title="Applications list"
        extra={
          !isAdmin && (
            <Space className="w-full justify-end">
              <Button onClick={() => setOpenAddAppDrawer(true)} type="primary">
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
      </PagePanel>
    </>
  );
};
