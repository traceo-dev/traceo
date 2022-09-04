import { Typography } from "antd";
import { useSelector } from "react-redux";
import { ColumnSection } from "src/core/components/ColumnSection";
import AppSettingsNavigationPage from "src/features/app/settings/components/AppSettingsNavigation";
import { StoreState } from "src/types/store";

export const AppSettingsCredentialsPage = () => {
  const { application } = useSelector((state: StoreState) => state.application);

  return (
    <AppSettingsNavigationPage>
      <ColumnSection
        marginTop={0}
        firstColumnWidth={11}
        secondColumnWidth={13}
        title="DSN"
        subtitle="Thanks to the DSN (Data Source Name), the Traceo SDK knows where to send all the Incidents that it captures in your application."
      >
        <Typography.Paragraph
          copyable
          className="text-xs bg-canvas p-3 main-border rounded-md"
        >
          {application?.dsn}
        </Typography.Paragraph>
      </ColumnSection>
    </AppSettingsNavigationPage>
  );
};

export default AppSettingsCredentialsPage;
