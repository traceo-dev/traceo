import { Space, Typography } from "antd";
import { useSelector } from "react-redux";
import { CollapsedDetails } from "../../../../core/components/CollapsedDetails";
import { PagePanel } from "../../../../core/components/PagePanel";
import { StoreState } from "../../../../types/store";

export const Exception = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);
  return (
    <PagePanel>
      <CollapsedDetails label="Exception">
        <Space className="code-container text-xs whitespace-pre p-5 JetBrainsFont bg-gray-800">
          <Typography.Text>{incident?.stack}</Typography.Text>
        </Space>
      </CollapsedDetails>
    </PagePanel>
  );
};
