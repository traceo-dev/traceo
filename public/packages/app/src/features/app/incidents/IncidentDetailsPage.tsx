import { ErrorsSection } from "./components/ErrorsSection";
import { ExceptionSection } from "./components/ExceptionSection";
import IncidentPageWrapper from "./components/IncidentPageWrapper";
import { InfoSection } from "./components/InfoSection";
import { PlatformSection } from "./components/PlatformSection";
import { StacktraceSection } from "./components/StacktraceSection";

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
