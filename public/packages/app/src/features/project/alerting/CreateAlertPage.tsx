import { BellOutlined } from "@ant-design/icons";
import { Button, Card } from "@traceo/ui";
import { useNavigate } from "react-router-dom";
import { Page } from "src/core/components/Page";

const CreateAlertPage = () => {
  const navigate = useNavigate();
  return (
    <Page
      header={{
        title: "Alerting / Create",
        description: "Get informed about disturbing behavior as soon as it occurs.",
        icon: <BellOutlined />,
        suffix: (
          <div className="flex flex-row gap-x-3">
            <Button variant="danger" onClick={() => navigate("/project/:id/alerting")}>
              Cancel
            </Button>
            <Button variant="primary">Save</Button>
          </div>
        )
      }}
    >
      <Page.Content>
        <Card>Create alert content</Card>
      </Page.Content>
    </Page>
  );
};

export default CreateAlertPage;
