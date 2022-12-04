import { Space, Typography, Button } from "antd";
import { ColumnSection } from "../../../../core/components/ColumnSection";
import { GH_SDK_REPO_LINK } from "../../../../core/utils/constants";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../types/store";
import { PagePanel } from "../../../../core/components/PagePanel";

export const NotIntegratedSection = () => {
  const { application } = useSelector((state: StoreState) => state.application);

  const appIdLine = `  appId: '${application.id}',`;

  return (
    !application.isIntegrated && (
      <PagePanel>
        <ColumnSection
          title="Welcome to your new app"
          subtitle={
            <Space className="w-full" direction="vertical">
              <Typography.Text>
                We noticed that the Traceo SDK has not yet been integrated into this
                application. To do this, use the example code on the right and restart
                your software.
              </Typography.Text>
              <Space className="w-full mt-5">
                <Button onClick={() => window.open(GH_SDK_REPO_LINK, "_blank")}>
                  Documentation
                </Button>
              </Space>
              <Typography.Text className="text-2xs">
                This section will be hidden after receiving the first information from the
                application via the SDK.
              </Typography.Text>
            </Space>
          }
          firstColumnWidth={12}
          secondColumnWidth={12}
        >
          <Space className="code-container p-3 mb-5 bg-canvas text-white">
            <Typography.Text>
              <ol>
                <li className="code-line">{"import { TraceoClient } from 'traceo';"}</li>
                <li className="code-line"></li>
                <li className="code-line">{"new TraceoClient({"}</li>
                <li className="code-line">{appIdLine}</li>
                <li className="code-line">{"  apiKey: '<API_KEY>',"}</li>
                <li className="code-line">
                  {"  url: 'http://localhost:3000', //or copy url from your browser"}
                </li>
                <li className="code-line">{"});"}</li>
                <li className="code-line"></li>
              </ol>
            </Typography.Text>
          </Space>
        </ColumnSection>
      </PagePanel>
    )
  );
};
