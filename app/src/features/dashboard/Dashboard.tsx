import { useState } from "react";
import { DashboardPage } from "./components/DashboardPage";
import { useAppStoreClean } from "../../core/hooks/useCleanup";
import { AppsTable } from "./components/AppsTable";
import { PlusOutlined } from "@ant-design/icons";
import ServerPermissions from "../../core/components/ServerPermissions";
import { NewApplicationModal } from "../../core/components/Modals/NewApplicationModal";
import { Button } from "core/ui-components/Button";
import { Card } from "core/ui-components/Card";

export const Dashboard = () => {
  const [openApplicationModal, setOpenApplicationModal] = useState<boolean>(false);
  useAppStoreClean();

  return (
    <>
      <DashboardPage>
        <Card
          title="Applications"
          extra={
            <ServerPermissions>
              <Button
                icon={<PlusOutlined />}
                onClick={() => setOpenApplicationModal(true)}
              >
                New application
              </Button>
            </ServerPermissions>
          }
        >
          <AppsTable />
        </Card>
      </DashboardPage>
      <NewApplicationModal
        isOpen={openApplicationModal}
        onCancel={() => setOpenApplicationModal(false)}
      />
    </>
  );
};

export default Dashboard;
