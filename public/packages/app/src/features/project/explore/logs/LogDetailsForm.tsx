import { ILog } from "@traceo/types";

export const LogDetailsForm = (log: ILog) => {
  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex flex-col">
        <span className="text-2xs font-semibold">Message</span>
        <span className="">{log?.message}</span>
      </div>
      <div className="flex flex-col gap-y-1">
        <span className="text-2xs font-semibold">Timestamp</span>
        <span className="">{log?.timestamp}</span>
      </div>
    </div>
  );
};
