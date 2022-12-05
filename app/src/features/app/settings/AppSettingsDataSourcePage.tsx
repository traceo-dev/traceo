import { Space, Typography, Select } from "antd";
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
import { loadApplication } from "../state/actions";
import { useMemberRole } from "../../../core/hooks/useMemberRole";

interface DataSourceSelectOption {
  label: string;
  description: string;
  key: TSDB;
}
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

  const dataSources: DataSourceSelectOption[] = [
    {
      label: "InfluxDB",
      description: "High-speed read and write database. Supported in version +1.8.",
      key: TSDB.INFLUX2
    }
  ];

  const isDisabled = () =>
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
          firstColumnWidth={12}
          secondColumnWidth={12}
          subtitle="Configure a connection to the time series database to enable metrics
          collection in this app."
        >
          <Space className="w-2/3" direction="vertical">
            <Typography.Text>Data Source</Typography.Text>
            <Select
              className="w-full"
              placeholder="Select data source provider"
              value={selectedDS}
              onSelect={(a) => setSelectedDS(a)}
              disabled={isDisabled()}
            >
              {dataSources?.map(({ description, key, label }) => (
                <Select.Option key={key}>
                  <Space direction="vertical" className="w-full gap-0">
                    <Typography.Text>{label}</Typography.Text>
                    <Typography.Text className="text-xs text-gray-400 font-normal">
                      {description}
                    </Typography.Text>
                  </Space>
                </Select.Option>
              ))}
            </Select>
            {renderForm()}
          </Space>
        </ColumnSection>
      </PagePanel>
    </AppSettingsNavigationPage>
  );
};

export default AppSettingsDataSourcePage;
