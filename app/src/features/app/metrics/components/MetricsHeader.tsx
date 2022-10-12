import { CheckCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";
import { Segmented, Space, Typography } from "antd";
import { PagePanel } from "core/components/PagePanel";
import { FC } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "types/store";
import { CONNECTION_STATUS } from "types/tsdb";

interface Props {
  hrCount: number;
  setHrCount: (val: number) => void;
}
export const MetricsHeader: FC<Props> = ({ hrCount, setHrCount }) => {
  const { application } = useSelector((state: StoreState) => state.application);
  const isConnected = application?.influxDS?.connStatus === CONNECTION_STATUS.CONNECTED;
  return (
    <PagePanel className="rounded-md p-5">
      <Space className="w-full justify-end">
        {isConnected && (
          <Space>
            <Segmented
              defaultValue={hrCount}
              options={[
                { value: 1, label: "1h" },
                { value: 3, label: "3h" },
                { value: 6, label: "6h" },
                { value: 12, label: "12h" },
                { value: 24, label: "24h" }
              ]}
              onChange={(v) => setHrCount(v as number)}
            />
          </Space>
        )}
      </Space>
    </PagePanel>
  );
};
