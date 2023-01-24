import { useApplication } from "core/hooks/useApplication";
import { Typography } from "core/ui-components/Typography";
import { ColumnSection } from "../../../core/components/ColumnSection";
import AppSettingsNavigationPage from "../../../features/app/settings/components/AppSettingsNavigation";

export const AppSettingsCredentialsPage = () => {
  const { application } = useApplication();

  return (
    <AppSettingsNavigationPage>
      <ColumnSection
        marginTop={0}
        title="DSN"
        subtitle="Thanks to the DSN (Data Source Name), the Traceo SDK knows where to send all the Incidents that it captures in your application."
      >
        <Typography
          // copyable
          size="xs"
          className="bg-canvas p-3 rounded-md"
        >
          {application?.dsn}
        </Typography>
      </ColumnSection>
    </AppSettingsNavigationPage>
  );
};

export default AppSettingsCredentialsPage;
