import { BellOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card } from "@traceo/ui";
import { useNavigate } from "react-router-dom";
import { Page } from "src/core/components/Page";

const AlertingPage = () => {
  const navigate = useNavigate();
  return (
    <Page
      header={{
        title: "Alerting",
        description: "Get informed about disturbing behavior as soon as it occurs.",
        icon: <BellOutlined />,
        suffix: (
          <Button
            icon={<PlusOutlined />}
            onClick={() => navigate("/project/:id/alerting/create")}
          >
            Create new
          </Button>
        )
      }}
    >
      <Page.Content>
        <Card>Alerting content</Card>
      </Page.Content>
    </Page>
  );
};

export default AlertingPage;
