import { Form, Input, Space, Alert, Button, Typography } from "antd";
import { Confirm } from "../../../../core/components/Confirm";
import api from "../../../../core/lib/api";
import { loadApplication } from "../../../../features/app/state/actions";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dispatch } from "../../../../store/store";
import { CONNECTION_STATUS, InfluxDS } from "../../../../types/tsdb";
import { StoreState } from "../../../../types/store";
import { INFLUX2_DOCS, REQUIRED_FIELD_ERROR } from "../../../../core/utils/constants";
import validators from "../../../../core/lib/validators";
import { useMemberRole } from "../../../../core/hooks/useMemberRole";
import { ApiResponse } from "../../../../types/api";

export const DataSourceInflux2Form = () => {
  const { application } = useSelector((state: StoreState) => state.application);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isDeletLoading, setDeleteLoading] = useState<boolean>(false);
  const { isViewer } = useMemberRole();

  const isDeleteDSBtn = !!application.connectedTSDB;

  const [form] = Form.useForm();

  useEffect(() => {
    const { bucket, org, url, token } = application?.influxDS as InfluxDS;
    form.setFieldsValue({
      url,
      bucket,
      org,
      token
    });
  }, []);

  const submit = () => form.submit();

  const update = async (form: {
    url: string;
    token: string;
    org: string;
    interval: number;
  }) => {
    setLoading(true);
    await api
      .post("/api/influx/config", {
        appId: application.id,
        ...form
      })
      .finally(() => {
        dispatch(loadApplication());
        setLoading(false);
      });
  };

  const remove = async () => {
    setDeleteLoading(true);
    await api
      .delete<ApiResponse<unknown>>("/api/datasource", {
        id: application.id
      })
      .then((response) => {
        if (response.status === "success") {
          dispatch(loadApplication());
        }
      })
      .finally(() => setDeleteLoading(false));
  };

  return (
    <>
      <Form
        disabled={isViewer}
        onFinish={update}
        form={form}
        layout="vertical"
        className="pt-5"
      >
        <Form.Item
          label="URL"
          name="url"
          requiredMark={"optional"}
          rules={[{ required: true, message: REQUIRED_FIELD_ERROR }, ...validators.url]}
        >
          <Input placeholder="http://localhost:8086/" />
        </Form.Item>
        <Form.Item
          label="Token"
          name="token"
          requiredMark={"optional"}
          rules={[{ required: true, message: REQUIRED_FIELD_ERROR }]}
        >
          <Input type="password" />
        </Form.Item>
        <Space className="w-full justify-between gap-0">
          <Form.Item
            label="Organization"
            name="org"
            requiredMark={"optional"}
            rules={[{ required: true, message: REQUIRED_FIELD_ERROR }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Bucket name"
            name="bucket"
            requiredMark={"optional"}
            rules={[{ required: true, message: REQUIRED_FIELD_ERROR }]}
          >
            <Input />
          </Form.Item>
        </Space>
      </Form>
      <Space className="pt-5">
        <Alert
          showIcon={true}
          type="info"
          message={
            <Typography.Link href={INFLUX2_DOCS} target="_blank">
              Official documentation
            </Typography.Link>
          }
        />
      </Space>
      <Space hidden={isViewer} className="w-full pt-5">
        <Button loading={isLoading} type="primary" onClick={submit}>
          Save & Test
        </Button>
        {isDeleteDSBtn && (
          <Confirm
            description="Are you sure that you want to remove InfluxDB configuration?"
            onOk={remove}
          >
            <Button loading={isDeletLoading} type="primary" danger>
              Remove
            </Button>
          </Confirm>
        )}
      </Space>
      {application.influxDS?.connStatus === CONNECTION_STATUS.FAILED && (
        <Alert
          className="mt-5"
          showIcon={true}
          type="error"
          message={application.influxDS.connError}
        />
      )}
    </>
  );
};
