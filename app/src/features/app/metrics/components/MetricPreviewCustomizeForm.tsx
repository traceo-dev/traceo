import { Collapse, Form, Input, Checkbox } from "antd";
import { FormInstance } from "antd/es/form/Form";
import { PagePanel } from "core/components/PagePanel";
import { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "types/store";

const { Panel } = Collapse;

interface Props {
  form: FormInstance;
}
export const MetricPreviewCustomizeForm: FC<Props> = ({ form }) => {
  const { metric } = useSelector((state: StoreState) => state.metrics);

  useEffect(() => {
    form.setFieldsValue(metric.config);
  }, [metric]);

  return (
    <>
      <div className="col-span-3">
        <PagePanel title="Basic" className="ml-2 customize-body">
          <Form form={form} layout="vertical">
            <Collapse ghost defaultActiveKey={"basic"}>
              <Panel className="pl-0" header="Basic informations" key={"basic"}>
                <Form.Item label="Name" name="name">
                  <Input />
                </Form.Item>
                <Form.Item label="Show description" name="showDescription">
                  <Checkbox />
                </Form.Item>
                <Form.Item label="Description" name="description">
                  <Input.TextArea rows={4} />
                </Form.Item>
              </Panel>
            </Collapse>
          </Form>
        </PagePanel>
      </div>
      <style>{`
        .customize-body > .ant-card-body {
            padding: 8px;
        }
      `}</style>
    </>
  );
};
