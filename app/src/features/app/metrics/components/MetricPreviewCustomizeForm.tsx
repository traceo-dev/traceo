import { Collapse, Form, Input, Checkbox, Select } from "antd";
import { FormInstance } from "antd/es/form/Form";
import { PagePanel } from "core/components/PagePanel";
import { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "types/store";
import { IMetric, METRIC_UNIT } from "types/metrics";
import { DeepPartial } from "types/partials";
import { DraftFunction } from "use-immer";

const { Panel } = Collapse;

interface Props {
  form: FormInstance;
  setOptions: (arg: DeepPartial<IMetric> | DraftFunction<DeepPartial<IMetric>>) => void;
}
export const MetricPreviewCustomizeForm: FC<Props> = ({ form, setOptions }) => {
  const { metric } = useSelector((state: StoreState) => state.metrics);

  useEffect(() => {
    form.setFieldsValue(metric.options);
  }, [metric]);

  const onChangeTooltip = (show: boolean) => {
    setOptions(({ config }) => {
      config.tooltip.show = show;
    });
  };

  const onChangeDescription = (show: boolean) => {
    setOptions(({ config }) => {
      config.showDescription = show;
    });
  };

  const onChangeLegend = (show: boolean) => {
    setOptions(({ config }) => {
      config.legend.show = show;
    });
  };

  const onChangeUnit = (unit: string) => {
    setOptions((a) => {
      a.unit = unit;
    });
  };

  return (
    <>
      <div className="col-span-3">
        <PagePanel title="Customize metric" className="ml-2 customize-body">
          <Form form={form} layout="vertical">
            <Collapse ghost defaultActiveKey={"basic"}>
              <Panel className="pl-0" header="Basic options" key={"basic"}>
                <Form.Item label="Name" name="name">
                  <Input maxLength={40} showCount />
                </Form.Item>
                <Form.Item label="Description" name="description">
                  <Input.TextArea rows={4} maxLength={1000} showCount />
                </Form.Item>
                <Form.Item label="Unit" name="unit">
                  <Select onChange={(v) => onChangeUnit(v)}>
                    {Object.values(METRIC_UNIT).map((val) => (
                      <Select.Option key={val}>{val ? val : "None"}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name={["config", "showDescription"]}
                  initialValue={metric.options.config.showDescription}
                  valuePropName="checked"
                >
                  <Checkbox onChange={(v) => onChangeDescription(v.target.checked)}>
                    Show description
                  </Checkbox>
                </Form.Item>
                <Form.Item
                  name={["config", "tooltip", "show"]}
                  initialValue={metric.options.config.tooltip?.show}
                  valuePropName="checked"
                >
                  <Checkbox onChange={(v) => onChangeTooltip(v.target.checked)}>
                    Show tooltip
                  </Checkbox>
                </Form.Item>
                <Form.Item
                  name={["config", "legend", "show"]}
                  initialValue={metric.options.config.legend?.show}
                  valuePropName="checked"
                >
                  <Checkbox onChange={(v) => onChangeLegend(v.target.checked)}>
                    Show legend
                  </Checkbox>
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
