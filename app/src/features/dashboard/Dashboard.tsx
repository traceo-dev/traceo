import { useState } from "react";
import { DashboardPage } from "./components/DashboardPage";
import { useAppStoreClean } from "../../core/hooks/useCleanup";
import { AppsTable } from "./components/AppsTable";
import { PlusOutlined } from "@ant-design/icons";
import ServerPermissions from "../../core/components/ServerPermissions";
import { CreateApplicationModal } from "../../core/components/Modals/CreateApplicationModal";
import { Button } from "core/ui-components/Button/Button";
import { Card } from "core/ui-components/Card/Card";

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
      <CreateApplicationModal
        isOpen={openApplicationModal}
        onCancel={() => setOpenApplicationModal(false)}
      />
    </>
  );
};

export default Dashboard;
