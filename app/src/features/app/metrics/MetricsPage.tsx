import { Typography } from "antd";
import { useSelector } from "react-redux";
import { StoreState } from "types/store";
import AppMetricsNavigationPage from "./components/AppMetricsNavigationPage";
import { NotConnectedTSDB } from "./components/NotConnectedTSDB";

const MetricsPage = () => {
  const { application } = useSelector((state: StoreState) => state.application);

  const isConnectedTSDB = !!application.connectedTSDB;

  return (
    <>
      <AppMetricsNavigationPage>
        {!isConnectedTSDB ? (
          <NotConnectedTSDB />
        ) : (
          <Typography.Text>METRICS HERE HERE HERE</Typography.Text>
        )}
      </AppMetricsNavigationPage>
    </>
  );
};

export default MetricsPage;
