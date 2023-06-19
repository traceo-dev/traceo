import { ColumnSection } from "../../../../core/components/ColumnSection";
import { useProject } from "../../../../core/hooks/useProject";
import { Space, Button, Typography, Card } from "@traceo/ui";
import { SDK } from "@traceo/types";

const mapSdkToNpm: Record<SDK, string> = {
  [SDK.NESTJS]: "@traceo-sdk/node",
  [SDK.NODE]: "@traceo-sdk/node",
  [SDK.REACT]: "@traceo-sdk/react",
  [SDK.VUE]: "@traceo-sdk/vue"
};

const mapDocumentationLink: Record<SDK, string> = {
  [SDK.NESTJS]: "https://github.com/traceo-dev/traceo-sdk/tree/develop/packages/node",
  [SDK.NODE]: "https://github.com/traceo-dev/traceo-sdk/tree/develop/packages/node",
  [SDK.REACT]: "https://github.com/traceo-dev/traceo-sdk/tree/develop/packages/react",
  [SDK.VUE]: "https://github.com/traceo-dev/traceo-sdk/tree/develop/packages/vue"
};

export const NotIntegratedSection = () => {
  const { project } = useProject();

  const sampleIntegrationCode = `
    1   import { TraceoClient } from '${mapSdkToNpm[project.sdk]}';
    2 
    3   new TraceoClient('<API_KEY>', {
    4      host: '${window.location.origin}'
    5   });
    6 
  `;

  return (
    !project.isIntegrated && (
      <Card title="Welcome to your new project">
        <ColumnSection
          subtitle={
            <Space className="w-full" direction="vertical">
              <Typography size="xs">
                We noticed that the Traceo SDK has not yet been integrated into this project. To
                do this, use the example code on the right and restart your software.
              </Typography>
              <Space className="w-full mt-5">
                <Button onClick={() => window.open(mapDocumentationLink[project.sdk], "_blank")}>
                  Documentation
                </Button>
              </Space>
            </Space>
          }
        >
          <Space className="code-container p-3 mb-5 bg-canvas text-white w-full">
            <span className="leading-5 whitespace-pre w-full monospace text-primary text-xs">
              {sampleIntegrationCode}
            </span>
          </Space>
        </ColumnSection>
      </Card>
    )
  );
};
