import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../core/components/DataNotFound";
import { DescriptionRow, Descriptions } from "../../../core/components/Descriptions";
import { useProject } from "../../../core/hooks/useProject";
import ExplorePageWrapper from "./ExplorePageWrapper";
import { Alert, Card } from "@traceo/ui";

const ConfigurationPage = () => {
  const { project } = useProject();

  return (
    <ExplorePageWrapper>
      <Card title="Configuration">
        <Alert className="mb-5" type="info" message="A set of informations about this project fetched at the last time this program was run." />
        <ConditionalWrapper
          isEmpty={!project?.runtimeConfig}
          emptyView={
            <DataNotFound
              label="Configuration not found"
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

export default ConfigurationPage;
