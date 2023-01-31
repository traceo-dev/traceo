import { Space, Typography, Card, Select } from "@traceo/ui";
import { ColumnSection } from "../../../core/components/ColumnSection";
import { useEffect, useState } from "react";
import { TSDB_PROVIDER } from "@traceo/types";
import SettingsPageWrapper from "./components/SettingsPageWrapper";
import { DataSourceInflux2Form } from "./components/DataSourceInflux2Form";
import { useMemberRole } from "../../../core/hooks/useMemberRole";
import { useApplication } from "../../../core/hooks/useApplication";

const dataSourceOptions = [
  {
    label: "InfluxDB",
    description: "High-speed read and write database. Supported in version +1.8.",
    value: TSDB_PROVIDER.INFLUX2
  }
];

export const AppSettingsDataSourcePage = () => {
  const { application } = useApplication();
  const { isViewer } = useMemberRole();

  const [selectedDS, setSelectedDS] = useState<TSDB_PROVIDER>(null);

  useEffect(() => {
    setSelectedDS(application?.connectedTSDB);
  }, [application]);

  const isDisabled =
    isViewer || (application && !!application.connectedTSDB) ? true : false;

  const renderForm = () => {
    if (selectedDS === TSDB_PROVIDER.INFLUX2) {
      return <DataSourceInflux2Form />;
    }

    return null;
  };

  return (
    <SettingsPageWrapper>
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
    </SettingsPageWrapper>
  );
};

export default AppSettingsDataSourcePage;
