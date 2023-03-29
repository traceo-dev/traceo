import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../core/components/DataNotFound";
import { DescriptionRow, Descriptions } from "../../../core/components/Descriptions";
import { useProject } from "../../../core/hooks/useProject";
import ExplorePageWrapper from "./ExplorePageWrapper";
import { Card } from "@traceo/ui";

const RuntimePage = () => {
  const { project } = useProject();

  return (
    <ExplorePageWrapper>
      <Card title="Runtime configuration">
        <ConditionalWrapper
          isEmpty={!project?.runtimeConfig}
          emptyView={
            <DataNotFound
              label="Runtime configuration not found"
              explanation="To collect this information, run the project with connected Traceo SDK."
            />
          }
        >
          <Descriptions>
            {Object.entries(project?.runtimeConfig || {}).map(
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
