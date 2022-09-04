import AppPage from "src/core/components/Layout/Pages/AppPage";
import { TodaySection } from "src/features/app/overview/components/TodaySection";
import { OverviewSection } from "./components/OverviewSection";
import { RecentIncidentsSection } from "./components/RecentIncidentsSection";

export const AppOverviewPage = () => {
  return (
    <AppPage>
      <TodaySection />
      <OverviewSection />
      <RecentIncidentsSection />
    </AppPage>
  );
};

export default AppOverviewPage;
