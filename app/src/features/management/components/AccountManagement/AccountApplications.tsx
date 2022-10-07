import { Space, Typography, Button } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ConditionLayout } from "../../../../core/components/ConditionLayout";
import { AddToApplicationDrawer } from "../../../../core/components/Drawers/AddToApplicationDrawer";
import PageHeader from "../../../../core/components/PageHeader";
import { useApi } from "../../../../core/lib/useApi";
import { ApplicationMember, MemberRole } from "../../../../types/application";
import { StoreState } from "../../../../types/store";

import { DetailsSection } from "../../../../core/components/DetailsSection";
import {
  ApplicationMemberDescriptionTable,
  DescriptionAppRadioRow
} from "../ApplicationMemberDescriptionTable";

export const AccountApplications = () => {
  const { account } = useSelector((state: StoreState) => state.serverAccounts);
  const [isOpenAddAppDrawer, setOpenAddAppDrawer] = useState<boolean>(false);

  const isAdmin = account.email === "admin@localhost";

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
      <DetailsSection>
        <PageHeader
          fontSize={22}
          title="Applications"
          subTitle="List of applications to which access is granted"
          className="pb-5"
        />

        {!isAdmin && (
          <Space className="w-full justify-end">
            <Button onClick={() => setOpenAddAppDrawer(true)} type="primary">
              Add user to application
            </Button>
          </Space>
        )}

        <ConditionLayout
          emptyView={
            <Space className="w-full justify-center">
              <Typography.Text className="w-full justify-center">
                No applications
              </Typography.Text>
            </Space>
          }
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

        <AddToApplicationDrawer
          isOpen={isOpenAddAppDrawer}
          onCancel={() => setOpenAddAppDrawer(false)}
          postExecute={() => postExecute()}
        />
      </DetailsSection>
    </>
  );
};
