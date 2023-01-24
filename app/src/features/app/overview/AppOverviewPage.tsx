import { TodaySection } from "../../../features/app/overview/components/TodaySection";
import { OverviewSection } from "./components/OverviewSection";
import { RecentIncidentsSection } from "./components/RecentIncidentsSection";
import { NotIntegratedSection } from "./components/NotIntegratedSection";
import { Page } from "core/components/Page";

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
