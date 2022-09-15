import { InfoCircleOutlined } from "@ant-design/icons";
import { Drawer, Form, Select, Space, Typography } from "antd";
import { FC, useEffect, useState } from "react";
import { MemberRole, ApplicationMember } from "../../../types/application";
import { updateMember } from "../../../features/app/members/state/actions";
import { dispatch } from "../../../store/store";
import form from "antd/lib/form";
import { DrawerButtons } from "../DrawerButtons";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  member: ApplicationMember;
}
export const EditMemberDrawer: FC<Props> = ({ isOpen, onCancel, member }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldValue("role", member?.role);
  });

  const submit = () => form.submit();

  const onFinish = (form: { role: MemberRole }) => {
    dispatch(updateMember({ memberId: member.id, role: form.role }));
    onCancel();
  };

  return (
    <>
      <Drawer
        title="Update member"
        onClose={onCancel}
        visible={isOpen}
        closable={false}
        footer={<DrawerButtons onClose={() => onCancel()} onFinish={submit} />}
      >
        <Space
          direction="vertical"
          className="pt-0 px-4 w-full h-full justify-between text-center"
        >
          <Form onFinish={onFinish} form={form} layout="vertical" className="pt-5">
            <Form.Item name="role" label="Role" className="text-xs mb-0 font-semibold">
              <Select className="w-full" value={member?.role}>
                <Select.Option value={MemberRole.ADMINISTRATOR}>
                  Administrator
                </Select.Option>
                <Select.Option value={MemberRole.MAINTAINER}>Maintainer</Select.Option>
                <Select.Option value={MemberRole.VIEWER}>Viewer</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Space>
      </Drawer>
    </>
  );
};
