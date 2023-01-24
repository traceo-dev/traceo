import IncidentPageWrapper from "./components/IncidentPageWrapper";
import { Errors } from "./components/Errors";
import { StacktraceSection } from "./components/StacktraceSection";
import { Exception } from "./components/Exception";
import { PlatformSection } from "./components/PlatformSection";
import { InfoSection } from "./components/InfoSection";

export const IncidentDetailsPage = () => {
  return (
    <IncidentPageWrapper>
      <div className="w-full grid grid-cols-12">
        <div className="col-span-9">
          <StacktraceSection />
          <Exception />
          <Errors />
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
