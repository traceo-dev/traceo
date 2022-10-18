import { Card, Row, Space, Timeline, Typography } from "antd";
import { ConditionLayout } from "core/components/ConditionLayout";
import { DataNotFound } from "core/components/DataNotFound";
import { DescriptionRow, Descriptions } from "core/components/Descriptions";
import { PagePanel } from "core/components/PagePanel";
import { TraceoLoading } from "core/components/TraceoLoading";
import { conditionClass, joinClasses } from "core/utils/classes";
import { isEmptyObject } from "core/utils/object";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dispatch } from "store/store";
import { StoreState } from "types/store";
import AppExploreNavigationPage from "../components/AppExploreNavigation";
import { loadApplicationRuntime } from "./state/actions";

const AppRuntimePage = () => {
  const { runtime, hasFetched } = useSelector((state: StoreState) => state.configuration);
  const [selectedData, setSelectedData] = useState<any>();

  useEffect(() => {
    dispatch(loadApplicationRuntime());
  }, []);

  if (!runtime) {
    return <TraceoLoading />;
  }

  useEffect(() => {
    if (!selectedData) {
      setSelectedData(Object.entries(runtime)?.at(0)?.at(1));
    }
  }, [runtime]);

  return (
    <AppExploreNavigationPage>
      <PagePanel title="Runtime configuration">
        <ConditionLayout
          isLoading={!hasFetched}
          isEmpty={isEmptyObject(runtime)}
          emptyView={
            <DataNotFound
              label="Runtime configuration not found"
              explanation="To collect this information, run the application with connected Traceo SDK."
            />
          }
        >
          <Row className="w-full pt-8">
            <Timeline className="w-1/3">
              {Object.entries(runtime).map(([sectionName, sectionValue], index) => (
                <Timeline.Item color={"#1F2937"} key={index} className="pb-1">
                  <Card
                    className={joinClasses(
                      "m-0 p-0 default-card",
                      conditionClass(
                        sectionValue === selectedData,
                        "border-2 border-cyan-600"
                      )
                    )}
                    onClick={() => setSelectedData(sectionValue)}
                  >
                    <Typography.Text className="text-xs capitalize">
                      {sectionName}
                    </Typography.Text>
                  </Card>
                </Timeline.Item>
              ))}
            </Timeline>
            {selectedData && (
              <Space direction="vertical" className="w-2/3 px-5">
                <Descriptions>
                  {Object.entries(selectedData).map(
                    ([settingName, settingValue], index) => (
                      <DescriptionRow key={index} className="pl-5" label={settingName}>
                        {settingValue}
                      </DescriptionRow>
                    )
                  )}
                </Descriptions>
              </Space>
            )}
          </Row>
        </ConditionLayout>
      </PagePanel>
    </AppExploreNavigationPage>
  );
};

export default AppRuntimePage;
