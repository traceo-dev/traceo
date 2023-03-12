import { CopyOutlined } from "@ant-design/icons";
import { StoreState } from "@store/types";
import { Space, Card, Typography } from "@traceo/ui";
import { useSelector } from "react-redux";
import { copyToClipboad } from "src/core/utils/clipboard";

export const ExceptionSection = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);

  if (!incident?.stack) {
    return null;
  }

  return (
    <Card
      title="Exception"
      className="h-auto"
      extra={
        <CopyOutlined
          onClick={() => copyToClipboad(incident?.stack)}
          className="p-1 rounded cursor-pointer hover:bg-secondary"
        />
      }
    >
      <Space className="code-container whitespace-pre pl-5 whitespace-pre-wrap w-full">
        <Typography className="text-white" size="xs">
          {incident?.stack}
        </Typography>
      </Space>
    </Card>
  );
};
