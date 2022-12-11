import { Typography } from "antd";
import { PagePanel } from "../../../../core/components/PagePanel";
import AppPage from "../../../../features/app/components/AppPage";
import { handleHeaderInfo } from "../../../../types/metrics";

export const AppMetricsPreviewNavigationPage = ({ children }) => {
  const query = new URLSearchParams(location.search);
  const type = query.get("type");

  const info = handleHeaderInfo[type];

  return (
    <>
      <AppPage>
        <PagePanel title={info?.title}>
          <Typography.Paragraph>{info?.description}</Typography.Paragraph>
        </PagePanel>
        {children}
      </AppPage>
    </>
  );
};
