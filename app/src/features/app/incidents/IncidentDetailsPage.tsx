import IncidentPageWrapper from "./components/IncidentPageWrapper";
import { ErrorsSection } from "./components/ErrorsSection";
import { StacktraceSection } from "./components/StacktraceSection";
import { ExceptionSection } from "./components/ExceptionSection";
import { PlatformSection } from "./components/PlatformSection";
import { InfoSection } from "./components/InfoSection";

export const IncidentDetailsPage = () => {
  return (
    <IncidentPageWrapper>
      <div className="w-full grid grid-cols-12">
        <div className="col-span-9">
          <StacktraceSection />
          <ExceptionSection />
          <ErrorsSection />
        </div>
        <div className="col-span-3 ml-1">
          <InfoSection />
          <PlatformSection />
        </div>
      </div>
    </IncidentPageWrapper>
  );
};

export default IncidentDetailsPage;
