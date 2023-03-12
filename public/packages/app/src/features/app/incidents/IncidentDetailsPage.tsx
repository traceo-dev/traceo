import { StoreState } from "@store/types";
import { SDK } from "@traceo/types";
import { stat } from "fs";
import { useSelector } from "react-redux";
import { ErrorsSection } from "./components/ErrorsSection";
import { ExceptionSection } from "./components/ExceptionSection";
import IncidentPageWrapper from "./components/IncidentPageWrapper";
import { InfoSection } from "./components/InfoSection";
import { PlatformSection } from "./components/PlatformSection";
import { StacktraceSection } from "./components/StacktraceSection";
import { TimelineSection } from "./components/TimelineSection";

export const IncidentDetailsPage = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);

  return (
    <IncidentPageWrapper>
      <div className="w-full grid grid-cols-12">
        <div className="col-span-9">
          <StacktraceSection />
          <ExceptionSection />
          <ErrorsSection />
        </div>
        <div className="col-span-3 ml-1">
          <TimelineSection />
          <InfoSection />

          {incident.sdk !== SDK.REACT && <PlatformSection />}
        </div>
      </div>
    </IncidentPageWrapper>
  );
};

export default IncidentDetailsPage;
