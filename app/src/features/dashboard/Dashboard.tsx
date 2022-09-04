import { useEffect } from "react";
import { DashboardPage } from "src/core/components/Layout/Pages/DashboardPage";
import { PagePanel } from "src/core/components/PagePanel";
import { useAppStoreClean } from "src/core/hooks/useCleanup";
import { AppsTable } from "./components/AppsTable";

export const Dashboard = () => {
  useAppStoreClean();

  useEffect(() => {
    const chartsEnv = localStorage.getItem("chartsEnv") || "development";
    localStorage.setItem("env", chartsEnv);
  }, []);

  return (
    <DashboardPage>
      <PagePanel>
        <AppsTable />
      </PagePanel>
    </DashboardPage>
  );
};

export default Dashboard;
