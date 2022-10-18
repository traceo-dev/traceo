import { useEffect, useState } from "react";
import { DashboardPage } from "./components/DashboardPage";
import { PagePanel } from "../../core/components/PagePanel";
import { useAppStoreClean } from "../../core/hooks/useCleanup";
import { AppsTable } from "./components/AppsTable";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import ServerPermissions from "core/components/ServerPermissions";
import { CreateApplicationModal } from "core/components/Modals/CreateApplicationModal";

export const Dashboard = () => {
  useAppStoreClean();

  const [openApplicationModal, setOpenApplicationModal] = useState<boolean>(false);

  useEffect(() => {
    const chartsEnv = localStorage.getItem("chartsEnv") || "development";
    localStorage.setItem("env", chartsEnv);
  }, []);

  return (
    <>
      <DashboardPage>
        <PagePanel
          title="Applications"
          extra={
            <ServerPermissions>
              <Button
                icon={<PlusOutlined />}
                onClick={() => setOpenApplicationModal(true)}
                type="primary"
              >
                Create new app
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
