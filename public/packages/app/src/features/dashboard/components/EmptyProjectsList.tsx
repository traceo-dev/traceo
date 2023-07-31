import { FC } from "react";
import { Link } from "react-router-dom";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Space, Typography } from "@traceo/ui";
import { useUser } from "../../../core/hooks/useUser";

interface Props {
  constraints?: string;
}
export const EmptyProjectsList: FC<Props> = ({ constraints = null }) => {
  const { isAdmin } = useUser();

  return (
    <Space direction="vertical" className="font-semibold w-full items-center py-5 gap-0">
      <span className="text-2xl">
        <SearchOutlined />
      </span>
      <Typography size="xl" weight="semibold">
        {constraints ? "Not found" : "No projects found"}
      </Typography>
      <Typography size="xs" weight="normal" className="mt-1">
        {constraints ? (
          <span>
            No results found for: <b>{constraints}</b>
          </span>
        ) : !isAdmin ? (
          "Contact the administrator and start monitoring your projects!"
        ) : (
          "Start using Traceo by creating your first project or by joining to an existing one."
        )}
      </Typography>
      {isAdmin && !constraints && (
        <Link to={"/dashboard/new-project"}>
          <Button size="sm" className="mt-9" icon={<PlusOutlined />}>
            Create project
          </Button>
        </Link>
      )}
    </Space>
  );
};
