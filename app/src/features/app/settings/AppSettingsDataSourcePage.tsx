import { LoadingOutlined } from "@ant-design/icons";
import { Space, Typography, Select } from "antd";
import { ColumnSection } from "core/components/ColumnSection";
import { ConditionLayout } from "core/components/ConditionLayout";
import { PagePanel } from "core/components/PagePanel";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { dispatch } from "store/store";
import { TSDB } from "types/application";
import AppSettingsNavigationPage from "../../../features/app/settings/components/AppSettingsNavigation";
import { StoreState } from "../../../types/store";
import { DataSourceInflux2Form } from "./components/DataSourceInflux2Form";
import { loadDataSource } from "./state/actions";

interface DataSourceSelectOption {
  label: string;
  description: string;
  key: TSDB;
}
export const AppSettingsDataSourcePage = () => {
  const { id } = useParams();
  const { application } = useSelector((state: StoreState) => state.application);
  const { dataSource, hasFetched } = useSelector((state: StoreState) => state.settings);

  const [selectedDS, setSelectedDS] = useState<TSDB>(application?.connectedTSDB || null);

  useEffect(() => {
    dispatch(loadDataSource(id));
  }, []);

  const dataSources: DataSourceSelectOption[] = [
    {
      label: "InfluxDB",
      description: "High-speed read and write database. Supported in version +1.8.",
      key: TSDB.INFLUX2
    }
    // {
    //   label: "Prometheus",
    //   description: "Open source time series database.",
    //   key: TSDB.PROMETHEUS
    // }
  ];

  return (
    <AppSettingsNavigationPage isPanel={false}>
      <PagePanel className="mt-0 rounded-none rounded-b-md">
        <ColumnSection
          marginTop={0}
          firstColumnWidth={12}
          secondColumnWidth={12}
          title="Metrics Data Source"
          subtitle="Configure a connection to the time series database to enable metrics
          collection in this app."
        >
          <Space className="w-2/3" direction="vertical">
            <Space className="w-full" direction="vertical">
              <Typography.Text>Data Source</Typography.Text>
              <Select
                className="w-full"
                value={selectedDS}
                onSelect={(a) => setSelectedDS(a)}
                disabled={!!application.connectedTSDB}
              >
                {dataSources.map(({ description, key, label }) => (
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
            </Space>

            {selectedDS === TSDB.INFLUX2 &&
              (hasFetched ? (
                <DataSourceInflux2Form dataSource={dataSource} />
              ) : (
                <Space className="w-full justify-center">
                  <LoadingOutlined />
                </Space>
              ))}
          </Space>
        </ColumnSection>
      </PagePanel>
    </AppSettingsNavigationPage>
  );
};

export default AppSettingsDataSourcePage;
