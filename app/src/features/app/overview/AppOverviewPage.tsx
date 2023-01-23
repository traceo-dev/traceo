import AppPage from "../components/AppPage";
import { TodaySection } from "../../../features/app/overview/components/TodaySection";
import { OverviewSection } from "./components/OverviewSection";
import { RecentIncidentsSection } from "./components/RecentIncidentsSection";
import { NotIntegratedSection } from "./components/NotIntegratedSection";

export const AppOverviewPage = () => {
  return (
    <AppPage>
      <NotIntegratedSection />
      <TodaySection />
      <OverviewSection />
      <RecentIncidentsSection />
    </AppPage>
  );
};

export default AppOverviewPage;
