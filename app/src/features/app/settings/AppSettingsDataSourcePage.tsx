import { Space } from "antd";
import { ColumnSection } from "../../../core/components/ColumnSection";
import { PagePanel } from "../../../core/components/PagePanel";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { dispatch } from "../../../store/store";
import { TSDB } from "../../../types/application";
import AppSettingsNavigationPage from "../../../features/app/settings/components/AppSettingsNavigation";
import { StoreState } from "../../../types/store";
import { DataSourceInflux2Form } from "./components/DataSourceInflux2Form";
import { useMemberRole } from "../../../core/hooks/useMemberRole";
import { loadApplication } from "../state/application/actions";
import { Select } from "core/ui-components/Select/Select";
import { Typography } from "core/ui-components/Typography/Typography";

const dataSourceOptions = [
  {
    label: "InfluxDB",
    description: "High-speed read and write database. Supported in version +1.8.",
    value: TSDB.INFLUX2
  }
];

export const AppSettingsDataSourcePage = () => {
  const { id } = useParams();
  const { application } = useSelector((state: StoreState) => state.application);
  const { isViewer } = useMemberRole();

  const [selectedDS, setSelectedDS] = useState<TSDB>(null);

  useEffect(() => {
    dispatch(loadApplication(id));
  }, []);

  useEffect(() => {
    setSelectedDS(application?.connectedTSDB);
  }, [application]);

  const isDisabled =
    isViewer || (application && !!application.connectedTSDB) ? true : false;

  const renderForm = () => {
    if (selectedDS === TSDB.INFLUX2) {
      return <DataSourceInflux2Form />;
    }

    return null;
  };

  return (
    <AppSettingsNavigationPage>
      <PagePanel title="Metrics Data Source">
        <ColumnSection
          subtitle="Configure a connection to the time series database to enable metrics
          collection in this app."
        >
          <Space className="w-2/3" direction="vertical">
            <Typography>Data Source</Typography>
            <Select
              options={dataSourceOptions}
              onChange={(opt) => setSelectedDS(opt?.value)}
              placeholder="Select data source provider"
              value={selectedDS}
              isDisabled={isDisabled}
            />
            {renderForm()}
          </Space>
        </ColumnSection>
      </PagePanel>
    </AppSettingsNavigationPage>
  );
};

export default AppSettingsDataSourcePage;
