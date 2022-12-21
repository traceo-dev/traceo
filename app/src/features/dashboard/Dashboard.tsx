import { useState } from "react";
import { DashboardPage } from "./components/DashboardPage";
import { PagePanel } from "../../core/components/PagePanel";
import { useAppStoreClean } from "../../core/hooks/useCleanup";
import { AppsTable } from "./components/AppsTable";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import ServerPermissions from "../../core/components/ServerPermissions";
import { CreateApplicationModal } from "../../core/components/Modals/CreateApplicationModal";

export const Dashboard = () => {
  const [openApplicationModal, setOpenApplicationModal] = useState<boolean>(false);
  useAppStoreClean();

  return (
    <>
      <DashboardPage>
        <PagePanel
          className="mt-12"
          title="Applications"
          extra={
            <ServerPermissions>
              <Button
                icon={<PlusOutlined />}
                onClick={() => setOpenApplicationModal(true)}
                type="primary"
              >
                New application
              </Button>
            </ServerPermissions>
          }
        >
          <AppsTable />
        </PagePanel>
      </DashboardPage>
      <CreateApplicationModal
        isOpen={openApplicationModal}
        onCancel={() => setOpenApplicationModal(false)}
      />
    </>
  );
};

export default Dashboard;
