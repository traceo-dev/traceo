import { Page } from "../../../core/components/Page";
import { NotIntegratedSection } from "./components/NotIntegratedSection";
import { OverviewSection } from "./components/OverviewSection";
import { RecentIncidentsSection } from "./components/RecentIncidentsSection";
import { TodaySection } from "./components/TodaySection";

export const AppOverviewPage = () => {
  return (
    <Page>
      <Page.Content>
        <NotIntegratedSection />
        <TodaySection />
        <OverviewSection />
        <RecentIncidentsSection />
      </Page.Content>
    </Page>
  );
};

export default AppOverviewPage;
