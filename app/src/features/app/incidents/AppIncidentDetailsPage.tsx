import AppIncidentNavigationPage from "src/features/app/incidents/components/AppIncidentNavigationPage";
import { InfoSection } from "./components/InfoSection";
import { Errors } from "./components/Errors";
import { StacktraceSection } from "./components/StacktraceSection";
import { Exception } from "./components/Exception";

export const AppIncidentDetailsPage = () => {
  return (
    <>
      <AppIncidentNavigationPage>
        <InfoSection />
        <Exception />
        <StacktraceSection />
        <Errors />
      </AppIncidentNavigationPage>
    </>
  );
};

export default AppIncidentDetailsPage;
