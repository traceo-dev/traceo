import { Form, Modal, Select, Space } from "antd";
import { FC, useState } from "react";
import { handleIncidentStatus, IncidentStatus } from "../../../types/incidents";
import { isEmptyObject } from "../../utils/object";
import { dispatch } from "../../../store/store";
import { batchUpdate } from "../../../features/app/incidents/state/actions";

interface Props {
  incidentsIds: string[];
  isOpen: boolean;
  onClose: () => void;
}

export const BatchUpdateModal: FC<Props> = ({ incidentsIds, isOpen, onClose }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const submit = () => {
    setLoading(true);

    const update = form.getFieldsValue();
    if (isEmptyObject(update)) {
      setLoading(false);
      return;
    }

    dispatch(batchUpdate({ incidentsIds, update }));
    onClose();
    setLoading(false);
  };

  return (
    <Modal
      title="Batch update"
      onCancel={onClose}
      onOk={submit}
      confirmLoading={isLoading}
      open={isOpen}
      closable={false}
    >
      <Space direction="vertical" className="w-full">
        <Form form={form} layout="vertical">
          <Form.Item name="status" label="Status">
            <Select showArrow className="capitalize">
              {Object.values(IncidentStatus).map((status, index) => (
                <Select.Option key={index} value={status}>
                  {handleIncidentStatus[status]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Space>
    </Modal>
  );
};
