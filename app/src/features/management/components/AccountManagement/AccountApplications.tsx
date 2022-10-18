import { Space, Button } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ConditionLayout } from "../../../../core/components/ConditionLayout";
import { useApi } from "../../../../core/lib/useApi";
import { ApplicationMember, MemberRole } from "../../../../types/application";
import { StoreState } from "../../../../types/store";

import {
  ApplicationMemberDescriptionTable,
  DescriptionAppRadioRow
} from "../ApplicationMemberDescriptionTable";
import { AddToApplicationModal } from "core/components/Modals/AddToApplicationModal";
import { DataNotFound } from "core/components/DataNotFound";
import { PagePanel } from "core/components/PagePanel";
import { ADMIN_EMAIL } from "core/utils/constants";

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
        <ConditionLayout
          emptyView={<DataNotFound label="No application found" />}
          isEmpty={applications?.length === 0}
          isLoading={isLoading}
        >
          <ApplicationMemberDescriptionTable>
            {applications?.map((member, index) => (
              <DescriptionAppRadioRow
                key={index}
                item={member}
                type="application"
                options={[
                  { label: "Administrator", value: MemberRole.ADMINISTRATOR },
                  { label: "Maintainer", value: MemberRole.MAINTAINER },
                  { label: "Viewer", value: MemberRole.VIEWER }
                ]}
                postExecute={postExecute}
                editable={!isAdmin}
              />
            ))}
          </ApplicationMemberDescriptionTable>
        </ConditionLayout>

        <AddToApplicationModal
          isOpen={isOpenAddAppDrawer}
          onCancel={() => setOpenAddAppDrawer(false)}
          postExecute={() => postExecute()}
        />
      </PagePanel>
    </>
  );
};
