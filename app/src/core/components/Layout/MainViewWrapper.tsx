import { Page } from "../Page";
import { DashboardHeader } from "./DashboardHeader";

export const MainViewWrapper = ({ children }) => {
  return (
    <div className="flex flex-1 flex-col">
      <main className="flex w-full flex-1 flex-col overflow-x-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto" style={{ maxHeight: "100vh" }}>
          <Page>{children}</Page>
        </main>
      </main>
    </div>
  );
};
