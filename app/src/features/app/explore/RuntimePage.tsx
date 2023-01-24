import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../core/components/DataNotFound";
import { DescriptionRow, Descriptions } from "../../../core/components/Descriptions";
import ExplorePageWrapper from "./ExplorePageWrapper";
import { Card } from "core/ui-components/Card";
import { useApplication } from "core/hooks/useApplication";

const RuntimePage = () => {
  const { application } = useApplication();

  return (
    <ExplorePageWrapper>
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
    </ExplorePageWrapper>
  );
};

export default RuntimePage;
