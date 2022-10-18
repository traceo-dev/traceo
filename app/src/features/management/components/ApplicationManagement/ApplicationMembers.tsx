import { Space, Typography } from "antd";
import { PagePanel } from "core/components/PagePanel";
import { ADMIN_EMAIL } from "core/utils/constants";
import { useParams } from "react-router-dom";
import { ConditionLayout } from "../../../../core/components/ConditionLayout";
import { useApi } from "../../../../core/lib/useApi";
import { ApplicationMember, MemberRole } from "../../../../types/application";
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
      <PagePanel title="Application members">
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
                editable={member.account.email !== ADMIN_EMAIL}
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
      </PagePanel>
    </>
  );
};
