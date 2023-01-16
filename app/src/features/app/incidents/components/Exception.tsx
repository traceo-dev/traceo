import { Space } from "core/ui-components/Space";
import { Card } from "core/ui-components/Card";
import { Typography } from "core/ui-components/Typography";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../types/store";

export const Exception = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);

  if (!incident?.stack) {
    return null;
  }
  return (
    <Card title="Exception" className="h-min">
      <Space className="code-container whitespace-pre p-5 bg-secondary whitespace-pre-wrap">
        <Typography size="xs">{incident?.stack}</Typography>
      </Space>
    </Card>
  );
};
