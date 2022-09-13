import { Space, Typography } from "antd";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ConditionLayout } from "../../../../core/components/ConditionLayout";
import { DetailsSection } from "../../../../core/components/DetailsSection";
import PageHeader from "../../../../core/components/PageHeader";
import { useApi } from "../../../../core/lib/useApi";
import { ApplicationMember, MemberRole } from "../../../../types/application";
import { StoreState } from "../../../../types/store";
import {
  ApplicationMemberDescriptionTable,
  DescriptionAppRadioRow
} from "../ApplicationMemberDescriptionTable";

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
            {members?.map((member, index) => (
              <DescriptionAppRadioRow
                key={index}
                item={member}
                type="member"
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
