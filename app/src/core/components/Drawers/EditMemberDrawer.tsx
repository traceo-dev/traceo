import { InfoCircleOutlined } from "@ant-design/icons";
import { Drawer, Select, Space, Typography } from "antd";
import { FC } from "react";
import { MEMBER_STATUS, ApplicationMember } from "src/types/application";
import { updateMember } from "src/features/app/members/state/actions";
import { dispatch } from "src/store/store";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  member: ApplicationMember;
}
export const EditMemberDrawer: FC<Props> = ({ isOpen, onCancel, member }) => {
  const handleChangeStatus = async (status: MEMBER_STATUS) => {
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
              <Select.Option value={MEMBER_STATUS.ADMINISTRATOR}>
                Administrator
              </Select.Option>
              <Select.Option value={MEMBER_STATUS.DEVELOPER}>Developer</Select.Option>
              <Select.Option value={MEMBER_STATUS.OWNER} disabled>
                Owner
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
