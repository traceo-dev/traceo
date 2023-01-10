import { Space } from "antd";
import { Typography } from "core/ui-components/Typography/Typography";
import { useSelector } from "react-redux";
import { PagePanel } from "../../../../core/components/PagePanel";
import { StoreState } from "../../../../types/store";

export const Exception = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);
  return (
    incident?.stack && (
      <PagePanel title="Exception">
        <Space className="code-container whitespace-pre p-5 bg-secondary whitespace-pre-wrap">
          <Typography size="xs">{incident?.stack}</Typography>
        </Space>
      </PagePanel>
    )
  );
};
