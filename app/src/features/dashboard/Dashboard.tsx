import { useEffect, useState } from "react";
import { DashboardPage } from "./components/DashboardPage";
import { PagePanel } from "../../core/components/PagePanel";
import { useAppStoreClean } from "../../core/hooks/useCleanup";
import { AppsTable } from "./components/AppsTable";
import { ClockCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import ServerPermissions from "../../core/components/ServerPermissions";
import { CreateApplicationModal } from "../../core/components/Modals/CreateApplicationModal";
import PageHeader from "../../core/components/PageHeader";
import { useSelector } from "react-redux";
import { StoreState } from "../../types/store";
import dateUtils from "../../core/utils/date";

export const Dashboard = () => {
  useAppStoreClean();

  const { account } = useSelector((state: StoreState) => state.account);

  const [openApplicationModal, setOpenApplicationModal] = useState<boolean>(false);

  useEffect(() => {
    const chartsEnv = localStorage.getItem("chartsEnv") || "development";
    localStorage.setItem("env", chartsEnv);
  }, []);

  return (
    <>
      <DashboardPage>
        <PageHeader
          title={`Welcome, ${account?.name || account.username} 👋`}
          subTitle={
            <Space>
              <ClockCircleOutlined />
              {dateUtils.formatDate(dateUtils.toUnix(), "HH:mm, DD MMM YYYY")}
            </Space>
          }
        />
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
