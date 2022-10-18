import { Form, Modal, Select, Space } from "antd";
import { FC, useEffect } from "react";
import { MemberRole, ApplicationMember } from "../../../types/application";
import { updateMember } from "../../../features/app/settings/state/members/actions";
import { dispatch } from "../../../store/store";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  member: ApplicationMember;
}
export const EditMemberModal: FC<Props> = ({ isOpen, onCancel, member }) => {
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
      <Modal
        title="Update member"
        onCancel={onCancel}
        visible={isOpen}
        onOk={submit}
        closable={false}
      >
        <Space
          direction="vertical"
          className="pt-0 px-4 w-full h-full justify-between text-center"
        >
          <Form onFinish={onFinish} form={form} layout="vertical">
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
      </Modal>
    </>
  );
};
