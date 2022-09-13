import { Typography } from "antd";
import { DashboardSettingsNavigation } from "../../features/settings/components/DashboardSettingsNavigation";

export const SettingsNotificationsPage = () => {
  return (
    <DashboardSettingsNavigation>
      <Typography.Text>{"Notifications"}</Typography.Text>
    </DashboardSettingsNavigation>
  );
};

export default SettingsNotificationsPage;
