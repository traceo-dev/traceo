import { LoadingOutlined } from "@ant-design/icons";
import { Form, Input, Space, Alert, Button, Typography } from "antd";
import { Confirm } from "core/components/Confirm";
import api from "core/lib/api";
import { notify } from "core/utils/notify";
import { loadApplication } from "features/app/state/actions";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dispatch } from "store/store";
import { InfluxDS } from "types/application";
import { StoreState } from "types/store";

interface Props {
  dataSource: object;
}
export const DataSourceInflux2Form: FC<Props> = ({ dataSource }) => {
  if (!dataSource) {
    return (
      <Space className="w-full justify-center">
        <LoadingOutlined />
      </Space>
    );
  }

  const { application } = useSelector((state: StoreState) => state.application);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isDeleteLoading, setDeleteLoading] = useState<boolean>(false);

  const isDeleteDSBtn = !!application.connectedTSDB;

  const [form] = Form.useForm();

  useEffect(() => {
    const { bucket, interval, org, timeout, url } = dataSource as InfluxDS;
    form.setFieldsValue({
      url,
      bucket,
      interval,
      org,
      timeout
    });
  }, []);

  const submit = () => form.submit();

  const update = async (form: {
    url: string;
    token: string;
    org: string;
    timeout: number;
    interval: number;
  }) => {
    setLoading(true);

    try {
      await api.post("/api/influx/config", {
        appId: application.id,
        ...form
      });
      notify.success("InfluxDB configured!");
    } catch (error) {
      notify.error(error);
    } finally {
      dispatch(loadApplication());
      setLoading(false);
    }
  };

  const remove = async () => {
    try {
      await api.delete("/api/datasource", {
        id: application.id
      });
      notify.success("Metrics Data Source removed!");

      window.location.reload();
    } catch (error) {
      notify.error(error);
    }
  };

  return (
    <>
      <Form onFinish={update} form={form} layout="vertical" className="pt-5">
        <Form.Item
          label="URL"
          name="url"
          requiredMark={"optional"}
          rules={[{ required: true, message: "Missing Influx instance URL" }]}
        >
          <Input placeholder="http://localhost:8086/" />
        </Form.Item>
        <Form.Item
          label="Token"
          name="token"
          requiredMark={"optional"}
          rules={[{ required: true, message: "Missing Influx auth Token" }]}
        >
          <Input type="password" />
        </Form.Item>
        <Space className="w-full justify-between gap-0">
          <Form.Item
            label="Organization"
            name="org"
            requiredMark={"optional"}
            rules={[{ required: true, message: "Missing Influx organization" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Bucket name"
            name="bucket"
            requiredMark={"optional"}
            rules={[{ required: true, message: "Missing Influx bucket" }]}
          >
            <Input />
          </Form.Item>
        </Space>
        <Space className="w-full justify-between gap-0">
          <Form.Item label="Timeout" name="timeout">
            <Input type="number" placeholder="5000ms" />
          </Form.Item>
          <Form.Item label="Scrap interval" name="interval">
            <Input type="number" placeholder="30s" />
          </Form.Item>
        </Space>
      </Form>
      <Space>
        <Alert
          showIcon={true}
          type="info"
          message={
            <Typography.Link
              href="https://docs.influxdata.com/influxdb/v2.4/install/"
              target="_blank"
            >
              Official documentation
            </Typography.Link>
          }
        />
      </Space>
      <Space className="w-full pt-5">
        <Button loading={isLoading} type="primary" onClick={submit}>
          Save
        </Button>
        {isDeleteDSBtn && (
          <Confirm
            description="Are you sure that you want to remove InfluxDB configuration?"
            onOk={remove}
          >
            <Button type="primary" danger>
              Remove
            </Button>
          </Confirm>
        )}
      </Space>
    </>
  );
};
