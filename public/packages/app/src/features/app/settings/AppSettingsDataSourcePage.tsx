import {
  Space,
  Typography,
  Card,
  Select,
  Alert,
  Button,
  ButtonContainer
} from "@traceo/ui";
import { ColumnSection } from "../../../core/components/ColumnSection";
import { useEffect, useState } from "react";
import {
  ApiResponse,
  ConnectionStatus,
  DataSourceConnStatus,
  DatasourceProvider,
  IDatasource,
  InfluxDS
} from "@traceo/types";
import SettingsPageWrapper from "./components/SettingsPageWrapper";
import { DataSourceInflux2Form } from "./components/DataSourceInflux2Form";
import { useMemberRole } from "../../../core/hooks/useMemberRole";
import { useApplication } from "../../../core/hooks/useApplication";
import { useRequest } from "../../../core/hooks/useRequest";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import api from "../../../core/lib/api";
import { loadApplication } from "../state/application/actions";
import { useAppDispatch } from "../../../store/index";
import { Confirm } from "../../../core/components/Confirm";

const dataSourceOptions = [
  {
    label: "InfluxDB",
    description: "High-speed read and write database. Supported in version +1.8.",
    value: DatasourceProvider.INLFUX_DB
  }
];

export const AppSettingsDataSourcePage = () => {
  const { application } = useApplication();
  const { isViewer } = useMemberRole();
  const dispatch = useAppDispatch();

  const [selectedDatasource, setSelectedDatasource] = useState<DatasourceProvider>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isDeletLoading, setDeleteLoading] = useState<boolean>(false);

  const {
    data: datasource,
    isLoading: isLoadingDatasource,
    execute: reloadDatasource
  } = useRequest<IDatasource>({
    url: "/api/datasource",
    params: {
      id: application?.tsdbDatasource
    },
    executeOnInit: false
  });

  const { data: connection, execute: checkConnection } = useRequest<DataSourceConnStatus>(
    {
      url: "/api/datasource/heartbeat",
      params: {
        id: application?.tsdbDatasource
      },
      executeOnInit: false
    }
  );

  useEffect(() => {
    setSelectedDatasource(datasource?.type);
  }, [datasource]);

  useEffect(() => {
    if (application?.tsdbDatasource) {
      reloadDatasource();
      checkConnection();
    }
  }, [application]);

  const isDisabled = isViewer || (application?.tsdbDatasource && !!datasource);
  const isDeleteBtn = !!application.tsdbDatasource;
  const isFailedConnection =
    application?.tsdbDatasource &&
    connection &&
    connection?.status === ConnectionStatus.FAILED;
  const isGoodConnection =
    application?.tsdbDatasource &&
    connection &&
    connection?.status === ConnectionStatus.CONNECTED;

  //TODO: add type
  const save = async (form: any) => {
    const { url, tsdbConfiguration } = form;
    setLoading(true);
    await api
      .post("/api/datasource/save", {
        // REMEMBER: If not empty then override settings on already existing object,
        // this field should be improved in case when on this page will be configs not only for tsdb
        id: application?.tsdbDatasource,
        appId: application.id,
        provider: selectedDatasource,
        url,
        details: {
          token: tsdbConfiguration.token,
          bucket: tsdbConfiguration.bucket,
          org: tsdbConfiguration.org
        }
      })
      .then(() => dispatch(loadApplication()))
      .finally(() => setLoading(false));
  };

  const remove = async () => {
    setDeleteLoading(true);
    await api
      .delete<ApiResponse<unknown>>("/api/datasource", {
        id: application?.tsdbDatasource
      })
      .then((response) => {
        if (response.status === "success") {
          dispatch(loadApplication());
          reloadDatasource();
        }
      })
      .finally(() => setDeleteLoading(false));
  };

  const renderForm = () => {
    switch (selectedDatasource) {
      case DatasourceProvider.INLFUX_DB: {
        return <DataSourceInflux2Form save={save} datasource={datasource} />;
      }
      default:
        return null;
    }
  };

  return (
    <SettingsPageWrapper>
      <Card title="Metrics Data Source">
        <ColumnSection
          subtitle="Configure a connection to the time series database to enable metrics
          collection in this app."
        >
          <ConditionalWrapper isLoading={isLoadingDatasource}>
            <Space className="w-2/3" direction="vertical">
              <Typography>Data Source</Typography>
              <Select
                options={dataSourceOptions}
                onChange={(opt) => setSelectedDatasource(opt?.value)}
                placeholder="Select data source provider"
                value={selectedDatasource}
                isDisabled={isDisabled}
              />
              {renderForm()}
              {isFailedConnection && (
                <Alert
                  className="mt-5"
                  showIcon={true}
                  type="error"
                  message={connection?.error}
                />
              )}
              {isGoodConnection && (
                <Alert
                  className="mt-5"
                  showIcon={true}
                  type="success"
                  message="Successfully connected"
                />
              )}
              {!isViewer && (
                <ButtonContainer justify="start">
                  {selectedDatasource && (
                    <Button loading={isLoading} type="submit" form="inlfux-provider-form">
                      Save & Test
                    </Button>
                  )}
                  {isDeleteBtn && (
                    <Confirm
                      description="Are you sure that you want to remove InfluxDB configuration?"
                      onOk={remove}
                    >
                      <Button loading={isDeletLoading} variant="danger">
                        Remove
                      </Button>
                    </Confirm>
                  )}
                </ButtonContainer>
              )}
            </Space>
          </ConditionalWrapper>
        </ColumnSection>
      </Card>
    </SettingsPageWrapper>
  );
};

export default AppSettingsDataSourcePage;
