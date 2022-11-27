import { Space, Typography, Button } from "antd";
import { ColumnSection } from "../../../../core/components/ColumnSection";
import { GH_SDK_REPO_LINK } from "../../../../core/utils/constants";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../types/store";

export const NotIntegratedSection = () => {
  const { application } = useSelector((state: StoreState) => state.application);

  const appIdLine = `  appId: ${application.id},`;

  return (
    !application.isIntegrated && (
      <Space className="w-full mb-12" direction="vertical">
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
          className="pt-12"
        >
          <Space className="code-container p-3 mb-5 bg-gray-800 text-white rounded-md">
            <Typography.Text>
              <ol>
                <li className="code-line">{"import { TraceoClient } from 'traceo';"}</li>
                <li className="code-line"></li>
                <li className="code-line">{"new TraceoClient({"}</li>
                <li className="code-line">{appIdLine}</li>
                <li className="code-line">
                  {"  url: 'http://localhost:3000', //or copy url from your browser"}
                </li>
                <li className="code-line">{"}"}</li>
              </ol>
            </Typography.Text>
          </Space>
        </ColumnSection>
      </Space>
    )
  );
};
