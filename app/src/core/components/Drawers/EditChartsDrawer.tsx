import { Space, Typography, Select, Drawer } from "antd";
import { useState } from "react";
import { DrawerButtons } from "../DrawerButtons";
import { dispatch } from "src/store/store";
import { loadApplications } from "src/features/dashboard/state/actions";

export const EditChartsDrawer = ({ isOpen, onCancel }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const currentChartsEnv = localStorage.getItem("chartsEnv") || "development";
  const [selectedChartEnv, setSelectedChartEnv] = useState<string>(currentChartsEnv);

  const onFinish = () => {
    setLoading(true);

    localStorage.setItem("chartsEnv", selectedChartEnv);
    localStorage.setItem("env", selectedChartEnv);

    setLoading(false);
    dispatch(loadApplications());

    onClose();
  };

  const onClose = () => {
    onCancel();
  };

  const envs = ["test", "development", "production"];

  return (
    <>
      <Drawer
        title="Edit charts"
        onClose={onCancel}
        visible={isOpen}
        size="default"
        closable={false}
        footer={<DrawerButtons onClose={onClose} onFinish={onFinish} loading={loading} />}
      >
        <Space direction="vertical" className="pt-0 px-4 w-full">
          <Space className="w-full" direction="vertical">
            <Typography.Text>Charts environment</Typography.Text>
            <Select
              defaultValue={currentChartsEnv}
              onChange={(val) => setSelectedChartEnv(val)}
              style={{ textAlign: "start", width: "100%" }}
            >
              {envs.map((env, index) => (
                <Select.Option className="capitalize" key={index} value={env}>
                  <Typography.Text className="capitalize">{env}</Typography.Text>
                </Select.Option>
              ))}
            </Select>
          </Space>
        </Space>
      </Drawer>
    </>
  );
};
