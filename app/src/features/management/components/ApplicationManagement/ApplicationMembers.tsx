import { Space, Typography } from "antd";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ConditionLayout } from "src/core/components/ConditionLayout";
import { DetailsSection } from "src/core/components/DetailsSection";
import PageHeader from "src/core/components/PageHeader";
import { useApi } from "src/core/lib/useApi";
import { ApplicationMember, MemberRole } from "src/types/application";
import { StoreState } from "src/types/store";
import {
  ApplicationMemberDescriptionTable,
  DescriptionAppRadioRow
} from "../ApplicationMemberDescriptionTable";

export const ApplicationMembers = () => {
  const { id } = useParams();
  const { application } = useSelector((state: StoreState) => state.serverApplications);

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
      <DetailsSection>
        <PageHeader title="Application members" subTitle="List of application members" />
        <ConditionLayout
          isEmpty={members?.length === 0}
          emptyView={
            <Space className="w-full justify-center">
              <Typography.Text className="w-full justify-center">
                No members
              </Typography.Text>
            </Space>
          }
          isLoading={isLoading}
        >
          <ApplicationMemberDescriptionTable>
            {members?.map((member) => (
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
          </ApplicationMemberDescriptionTable>
        </ConditionLayout>
      </DetailsSection>
    </>
  );
};
