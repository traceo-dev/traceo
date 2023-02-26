import { StoreState } from "@store/types";
import { Space, Card, Typography } from "@traceo/ui";
import { useSelector } from "react-redux";

export const ExceptionSection = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);

  if (!incident?.stack) {
    return null;
  }
  return (
    <Card title="Exception" className="h-auto">
      <Space className="code-container whitespace-pre p-5 bg-secondary whitespace-pre-wrap">
        <Typography size="xs">{incident?.stack}</Typography>
      </Space>
    </Card>
  );
};
