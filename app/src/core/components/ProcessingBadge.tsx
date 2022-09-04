import { FC } from "react";

export enum AppHealthStatus {
  STANDARD = "standard",
  WARNING = "warning",
  CRITICAL = "critical",
  EXPECTANCY = "expectancy"
}

export const ProcessingBadge: FC<{ status: AppHealthStatus }> = ({
  status = AppHealthStatus.STANDARD
}) => {
  const handleHealthStatusColor: Record<AppHealthStatus, string> = {
    [AppHealthStatus.EXPECTANCY]: "#0E7592",
    [AppHealthStatus.STANDARD]: "#14B7A7",
    [AppHealthStatus.WARNING]: "#D87706",
    [AppHealthStatus.CRITICAL]: "#B91C1C"
  };

  return (
    <>
      <div className="badge-status-dot" />
      <style>{`
        .badge-status-dot {
            position: relative;
            top: -1px;
            display: inline-block;
            width: 8px;
            height: 8px;
            vertical-align: middle;
            border-radius: 50%;
            background-color: ${handleHealthStatusColor[status]}
        }
        
        .badge-status-dot:after {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 4px solid ${
              status !== AppHealthStatus.EXPECTANCY
                ? handleHealthStatusColor[status]
                : "transparent"
            };
            border-radius: 50%;
            -webkit-animation: antStatusProcessing 1.2s infinite ease-in-out;
            animation: antStatusProcessing 1.2s infinite ease-in-out;
            content: "";
        }
      `}</style>
    </>
  );
};
