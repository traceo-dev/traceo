import { Space, Typography } from "antd";
import { useSelector } from "react-redux";
import { PagePanel } from "../../../../core/components/PagePanel";
import { StoreState } from "../../../../types/store";

export const Exception = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);
  return (
    incident?.stack !== "undefined" && (
      <PagePanel title="Exception">
        <Space className="code-container text-xs whitespace-pre p-5 bg-gray-800 whitespace-pre-wrap">
          <Typography.Text>{incident?.stack}</Typography.Text>
        </Space>
      </PagePanel>
    )
  );
};
