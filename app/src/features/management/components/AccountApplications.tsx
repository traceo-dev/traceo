import { LoadingOutlined } from "@ant-design/icons";
import { Space, Typography, Button } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { AddToApplicationDrawer } from "src/core/components/Drawers/AddToApplicationDrawer";
import PageHeader from "src/core/components/PageHeader";
import { useApi } from "src/core/lib/useApi";
import { ApplicationMember, MemberRole } from "src/types/application";
import { StoreState } from "src/types/store";
import {
  AccountDescriptionAppTable,
  DescriptionAppRadioRow
} from "./AccountDescriptionsAppTable";
import { AccountDetailsSection } from "./AccountDetailsSection";

export const AccountApplications = () => {
  const { account } = useSelector((state: StoreState) => state.serverAccounts);
  const [isOpenAddAppDrawer, setOpenAddAppDrawer] = useState<boolean>(false);

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
      <AccountDetailsSection>
        <PageHeader
          fontSize={22}
          title="Applications"
          subTitle="List of applications to which access is granted"
          className="pb-5"
        />

        <Space className="w-full justify-end">
          <Button onClick={() => setOpenAddAppDrawer(true)} type="primary">
            Add user to application
          </Button>
        </Space>
        {applications?.length > 0 ? (
          <AccountDescriptionAppTable>
            {applications?.map((member) => (
              <DescriptionAppRadioRow
                member={member}
                options={[
                  { label: "Administrator", value: MemberRole.ADMINISTRATOR },
                  { label: "Maintainer", value: MemberRole.MAINTAINER },
                  { label: "Viewer", value: MemberRole.VIEWER }
                ]}
                postExecute={postExecute}
              />
            ))}
          </AccountDescriptionAppTable>
        ) : (
          <Space className="w-full justify-center">
            <Typography.Text className="w-full justify-center">
              No applications
            </Typography.Text>
          </Space>
        )}

        <AddToApplicationDrawer
          isOpen={isOpenAddAppDrawer}
          onCancel={() => setOpenAddAppDrawer(false)}
          postExecute={() => postExecute()}
        />
      </AccountDetailsSection>
    </>
  );
};
