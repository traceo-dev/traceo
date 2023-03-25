import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../core/components/DataNotFound";
import { DescriptionRow, Descriptions } from "../../../core/components/Descriptions";
import { useApplication } from "../../../core/hooks/useApplication";
import ExplorePageWrapper from "./ExplorePageWrapper";
import { Card } from "@traceo/ui";

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
            {Object.entries(application?.runtimeConfig || {}).map(
              ([settingName, settingValue], index) => (
                <>
                  <DescriptionRow
                    key={index}
                    className="text-yellow-500 font-semibold"
                    label={settingName}
                  />

                  {Object.entries(settingValue).map(([childName, childValue], index2) => (
                    <DescriptionRow key={index2} className="ml-5" label={childName}>
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
