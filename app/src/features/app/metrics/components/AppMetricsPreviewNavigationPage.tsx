import { Typography } from "antd";
import { PagePanel } from "../../../../core/components/PagePanel";
import AppPage from "../../../../features/app/components/AppPage";

export const AppMetricsPreviewNavigationPage = ({ children }) => {
  const query = new URLSearchParams(location.search);
  const type = query.get("type");

  return (
    <>
      <AppPage>
        {/* <PagePanel title={info?.title}>
          <Typography.Paragraph>{info?.description}</Typography.Paragraph>
        </PagePanel> */}
        {children}
      </AppPage>
    </>
  );
};
