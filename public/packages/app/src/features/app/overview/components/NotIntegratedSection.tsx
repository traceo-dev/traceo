import { ColumnSection } from "../../../../core/components/ColumnSection";
import { useApplication } from "../../../../core/hooks/useApplication";
import { GH_SDK_REPO_LINK } from "../../../../core/utils/constants";
import { Space, Button, Typography, Card } from "@traceo/ui";

export const NotIntegratedSection = () => {
  const { application } = useApplication();

  const sampleIntegrationCode = `
    1   import { TraceoClient } from '@traceo-sdk/node';
    2 
    3   new TraceoClient({
    4      appId: '${application.id}',
    5      apiKey: '<API_KEY>',
    6      url: 'http://localhost:3000'
    7   });
    8 
  `;

  return (
    !application.isIntegrated && (
      <Card>
        <ColumnSection
          title="Welcome to your new app"
          subtitle={
            <Space className="w-full" direction="vertical">
              <Typography size="xs">
                We noticed that the Traceo SDK has not yet been integrated into this application.
                To do this, use the example code on the right and restart your software.
              </Typography>
              <Space className="w-full mt-5">
                <Button onClick={() => window.open(GH_SDK_REPO_LINK, "_blank")}>
                  Documentation
                </Button>
              </Space>
              <Typography size="xxs">
                This section will be hidden after receiving the first information from the
                application via the SDK.
              </Typography>
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
