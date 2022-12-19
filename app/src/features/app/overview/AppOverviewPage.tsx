import AppPage from "../components/AppPage";
import { TodaySection } from "../../../features/app/overview/components/TodaySection";
import { OverviewSection } from "./components/OverviewSection";
import { RecentIncidentsSection } from "./components/RecentIncidentsSection";
import { NotIntegratedSection } from "./components/NotIntegratedSection";
import { useCleanup } from "../../../core/hooks/useCleanup";
import { StoreState } from "../../../types/store";

export const AppOverviewPage = () => {
  useCleanup((state: StoreState) => state.incident);

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
