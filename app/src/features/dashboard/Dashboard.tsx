import { useState } from "react";
import { DashboardWrapper } from "./components/DashboardPage";
import { AppsTable } from "./components/AppsTable";
import { PlusOutlined } from "@ant-design/icons";
import ServerPermissions from "../../core/components/ServerPermissions";
import { NewApplicationModal } from "../../core/components/Modals/NewApplicationModal";
import { Button } from "core/ui-components/Button";
import { Card } from "core/ui-components/Card";

export const Dashboard = () => {
  const [openApplicationModal, setOpenApplicationModal] = useState<boolean>(false);
  return (
    <DashboardWrapper>
      <Card
        title="Applications"
        extra={
          <ServerPermissions>
            <NewApplicationModal
              isOpen={openApplicationModal}
              onCancel={() => setOpenApplicationModal(false)}
            >
              <Button
                icon={<PlusOutlined />}
                onClick={() => setOpenApplicationModal(true)}
              >
                New application
              </Button>
            </NewApplicationModal>
          </ServerPermissions>
        }
      >
        <AppsTable />
      </Card>
    </DashboardWrapper>
  );
};

export default Dashboard;
