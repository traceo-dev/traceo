import { DatabaseOutlined } from "@ant-design/icons";
import { Space, Typography, Button } from "antd";
import { slugifyForUrl } from "../../../../core/utils/stringUtils";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { StoreState } from "../../../../types/store";

export const NotConnectedTSDB = () => {
  const { application } = useSelector((state: StoreState) => state.application);
  const navigate = useNavigate();

  return (
    <Space className="w-full justify-center text-center" direction="vertical">
      <DatabaseOutlined className="text-5xl" />
      <Typography.Text className="text-3xl font-bold">
        Metrics are not available
      </Typography.Text>
      <Typography.Text>
        Configure a connection to the time series database to enable metrics collection.
      </Typography.Text>
      <Button
        onClick={() =>
          navigate(
            `/app/${application.id}/${slugifyForUrl(
              application.name
            )}/settings/datasource`
          )
        }
        className="mt-5"
        type="primary"
      >
        Configure
      </Button>
    </Space>
  );
};
