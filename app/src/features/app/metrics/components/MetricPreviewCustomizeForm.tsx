import { Collapse, Form, Input, Checkbox, Select, Slider } from "antd";
import { FormInstance } from "antd/es/form/Form";
import { PagePanel } from "core/components/PagePanel";
import { FC, useEffect, useState } from "react";
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
  const [isArea, setArea] = useState<boolean>(metric.options.config.area?.show);

  useEffect(() => {
    form.setFieldsValue(metric.options);
  }, [metric]);

  const onChangeTooltip = (show: boolean) => {
    setOptions(({ config }) => {
      config.tooltip.show = show;
    });
  };

  const onChangeDescription = (show: boolean) => {
    setOptions((opt) => {
      opt.showDescription = show;
    });
  };

  const onChangeLegend = (show: boolean) => {
    setOptions(({ config }) => {
      config.legend.show = show;
    });
  };

  const onChangeArea = (show: boolean) => {
    setArea(show);
    setOptions(({ config }) => {
      config.area.show = show;
    });
  };

  const onChangeMarkers = (show: boolean) => {
    setOptions(({ config }) => {
      config.line.marker.show = show;
    });
  };

  const onChangeAreaOpacity = (opacity: number) => {
    setOptions(({ config }) => {
      config.area.opacity = opacity;
    });
  };

  const onChangeLineWidth = (width: number) => {
    setOptions(({ config }) => {
      config.line.width = width;
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
                <Form.Item
                  label="Description"
                  name="description"
                  tooltip="Markdown supported"
                >
                  <Input.TextArea rows={4} maxLength={1000} showCount />
                </Form.Item>
                <Form.Item label="Unit" name="unit">
                  <Select onChange={(v) => onChangeUnit(v)}>
                    {Object.values(METRIC_UNIT).map((val) => (
                      <Select.Option key={val}>{val ? val : "None"}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="showDescription" valuePropName="checked">
                  <Checkbox onChange={(v) => onChangeDescription(v.target.checked)}>
                    Show description
                  </Checkbox>
                </Form.Item>
              </Panel>
              <Panel className="pl-0" header="Graph options" key={"graph"}>
                <Form.Item label="Line width" name={["config", "line", "width"]}>
                  <Slider
                    marks={{
                      1: 1,
                      10: 10
                    }}
                    min={1}
                    max={10}
                    onChange={(v) => onChangeLineWidth(v)}
                  />
                </Form.Item>
                <Form.Item
                  name={["config", "line", "marker", "show"]}
                  valuePropName="checked"
                >
                  <Checkbox onChange={(v) => onChangeMarkers(v.target.checked)}>
                    Show markers
                  </Checkbox>
                </Form.Item>
                <Form.Item name={["config", "tooltip", "show"]} valuePropName="checked">
                  <Checkbox onChange={(v) => onChangeTooltip(v.target.checked)}>
                    Show tooltip
                  </Checkbox>
                </Form.Item>
                <Form.Item name={["config", "legend", "show"]} valuePropName="checked">
                  <Checkbox onChange={(v) => onChangeLegend(v.target.checked)}>
                    Show legend
                  </Checkbox>
                </Form.Item>
                <Form.Item name={["config", "area", "show"]} valuePropName="checked">
                  <Checkbox onChange={(v) => onChangeArea(v.target.checked)}>
                    Show area
                  </Checkbox>
                </Form.Item>

                {isArea && (
                  <Form.Item label="Area opacity" name={["config", "area", "opacity"]}>
                    <Slider
                      tooltip={{
                        formatter: (val: number) => {
                          return val / 100;
                        }
                      }}
                      marks={{
                        0: 0,
                        100: 1
                      }}
                      min={0}
                      max={100}
                      onChange={(v) => onChangeAreaOpacity(v)}
                    />
                  </Form.Item>
                )}
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
