import { Space } from "core/ui-components/Space";
import { ColumnSection } from "../../../core/components/ColumnSection";
import { useEffect, useState } from "react";
import { TSDB } from "../../../types/application";
import AppSettingsNavigationPage from "../../../features/app/settings/components/AppSettingsNavigation";
import { DataSourceInflux2Form } from "./components/DataSourceInflux2Form";
import { useMemberRole } from "../../../core/hooks/useMemberRole";
import { Select } from "core/ui-components/Select";
import { Typography } from "core/ui-components/Typography";
import { Card } from "core/ui-components/Card";
import { useApplication } from "core/hooks/useApplication";

const dataSourceOptions = [
  {
    label: "InfluxDB",
    description: "High-speed read and write database. Supported in version +1.8.",
    value: TSDB.INFLUX2
  }
];

export const AppSettingsDataSourcePage = () => {
  const { application } = useApplication();
  const { isViewer } = useMemberRole();

  const [selectedDS, setSelectedDS] = useState<TSDB>(null);

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
      <Card title="Metrics Data Source">
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
      </Card>
    </AppSettingsNavigationPage>
  );
};

export default AppSettingsDataSourcePage;
