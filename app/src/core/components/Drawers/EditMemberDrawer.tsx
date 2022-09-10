import { InfoCircleOutlined } from "@ant-design/icons";
import { Drawer, Select, Space, Typography } from "antd";
import { FC } from "react";
import { MemberRole, ApplicationMember } from "src/types/application";
import { updateMember } from "src/features/app/members/state/actions";
import { dispatch } from "src/store/store";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  member: ApplicationMember;
}
export const EditMemberDrawer: FC<Props> = ({ isOpen, onCancel, member }) => {
  const handleChangeStatus = (status: MemberRole) => {
    dispatch(updateMember({ id: member.id, status }));
    onCancel();
    window.location.reload();
  };

  return (
    <>
      <Drawer
        title="Update member"
        onClose={onCancel}
        visible={isOpen}
        closable={false}
        footer={null}
      >
        <Space direction="vertical" className="h-full justify-between">
          <Space direction="vertical" className="w-full">
            <Typography style={{ fontWeight: 600 }}>Member status</Typography>
            <Select
              className="w-full"
              value={member?.status}
              onChange={(value) => handleChangeStatus(value)}
            >
              <Select.Option value={MemberRole.ADMINISTRATOR}>
                Administrator
              </Select.Option>
              <Select.Option value={MemberRole.MAINTAINER}>Maintainer</Select.Option>
              <Select.Option value={MemberRole.VIEWER} disabled>
                Viewer
              </Select.Option>
            </Select>
          </Space>

          <Typography className="text-2xs mt-3">
            <InfoCircleOutlined style={{ color: "red" }} /> Remember to set administrator
            rights only for a trusted persons. Administrators have rights that can hurt a
            lot in the wrong hands.
          </Typography>
        </Space>
      </Drawer>
    </>
  );
};
