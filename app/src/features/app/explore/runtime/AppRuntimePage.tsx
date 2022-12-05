import { ConditionLayout } from "../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { DescriptionRow, Descriptions } from "../../../../core/components/Descriptions";
import { PagePanel } from "../../../../core/components/PagePanel";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../types/store";
import AppExploreNavigationPage from "../components/AppExploreNavigation";

const AppRuntimePage = () => {
  const { application, hasFetched } = useSelector(
    (state: StoreState) => state.application
  );

  return (
    <AppExploreNavigationPage>
      <PagePanel title="Runtime configuration">
        <ConditionLayout
          isLoading={!hasFetched}
          isEmpty={!application?.runtimeConfig}
          emptyView={
            <DataNotFound
              label="Runtime configuration not found"
              explanation="To collect this information, run the application with connected Traceo SDK."
            />
          }
        >
          <Descriptions>
            {Object.entries(application?.runtimeConfig?.data || {}).map(
              ([settingName, settingValue], index) => (
                <>
                  <DescriptionRow
                    key={index}
                    className="text-yellow-500 font-semibold"
                    label={settingName}
                  >
                    {""}
                  </DescriptionRow>

                  {Object.entries(settingValue).map(([childName, childValue]) => (
                    <DescriptionRow key={index} className="ml-5" label={childName}>
                      {childValue}
                    </DescriptionRow>
                  ))}
                </>
              )
            )}
          </Descriptions>
        </ConditionLayout>
      </PagePanel>
    </AppExploreNavigationPage>
  );
};

export default AppRuntimePage;
