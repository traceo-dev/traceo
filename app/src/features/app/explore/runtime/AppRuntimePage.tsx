import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { DescriptionRow, Descriptions } from "../../../../core/components/Descriptions";
import AppExploreNavigationPage from "../AppExploreNavigation";
import { Card } from "core/ui-components/Card";
import { useApplication } from "core/hooks/useApplication";

const AppRuntimePage = () => {
  const { application } = useApplication();

  return (
    <AppExploreNavigationPage>
      <Card title="Runtime configuration">
        <ConditionalWrapper
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
                  />

                  {Object.entries(settingValue).map(([childName, childValue]) => (
                    <DescriptionRow key={index} className="ml-5" label={childName}>
                      {childValue}
                    </DescriptionRow>
                  ))}
                </>
              )
            )}
          </Descriptions>
        </ConditionalWrapper>
      </Card>
    </AppExploreNavigationPage>
  );
};

export default AppRuntimePage;
