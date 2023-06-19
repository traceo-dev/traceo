import { SDK } from "@traceo/types";
import { useIncidentSelector } from "../../../core/hooks/useIncidentSelector";
import IncidentPageWrapper from "./components/IncidentPageWrapper";
import { InfoSection } from "./components/InfoSection";
import { PlatformSection } from "./components/PlatformSection";
import { StacktraceSection } from "./components/StacktraceSection";

export const IncidentDetailsPage = () => {
  const { incident } = useIncidentSelector();

  return (
    <IncidentPageWrapper>
      <div className="w-full grid grid-cols-12">
        <div className="col-span-9">
          <StacktraceSection />
        </div>
        <div className="col-span-3 ml-1">
          <InfoSection />
          {incident.sdk !== SDK.REACT && <PlatformSection />}
        </div>
      </div>
    </IncidentPageWrapper>
  );
};

export default IncidentDetailsPage;
