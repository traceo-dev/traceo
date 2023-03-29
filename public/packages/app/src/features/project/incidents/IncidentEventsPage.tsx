import { StoreState } from "@store/types";
import { BROWSER_SDK } from "@traceo/types";
import { Card, Table, TableColumn } from "@traceo/ui";
import { useSelector } from "react-redux";
import dateUtils from "../../../core/utils/date";
import IncidentPageWrapper from "./components/IncidentPageWrapper";

const IncidentEventsPage = () => {
  const { incident, events, hasEventsFetched } = useSelector(
    (state: StoreState) => state.incident
  );

  const isBrowserSDK = BROWSER_SDK.includes(incident.sdk);

  const getPathname = (url: string): string => {
    const parsed = new URL(url);
    return parsed?.pathname ?? url;
  };

  return (
    <IncidentPageWrapper>
      <Card className="h-auto">
        <div className="h-96 overflow-y-scroll">
          <Table striped collection={events} loading={!hasEventsFetched}>
            <TableColumn name="Time" className="py-5">
              {({ item }) => dateUtils.formatDate(item?.date, "DD MMM YYYY HH:mm:ss:mmm")}
            </TableColumn>
            {isBrowserSDK && (
              <TableColumn name="Browser">
                {({ item }) => (
                  <span>
                    {JSON.parse(item.browser)?.browser?.name} (
                    {JSON.parse(item.browser)?.browser?.version})
                  </span>
                )}
              </TableColumn>
            )}
            {isBrowserSDK && (
              <TableColumn name="OS">
                {({ item }) => (
                  <span>
                    {JSON.parse(item.browser)?.os?.name} ({JSON.parse(item.browser).os?.version})
                  </span>
                )}
              </TableColumn>
            )}
            {isBrowserSDK && (
              <TableColumn name="Platform">
                {({ item }) => <span>{JSON.parse(item.browser)?.platform?.type}</span>}
              </TableColumn>
            )}
            {isBrowserSDK && (
              <TableColumn name="URL">
                {({ item }) => <span>{getPathname(JSON.parse(item.browser)?.url)}</span>}
              </TableColumn>
            )}
          </Table>
        </div>
      </Card>
    </IncidentPageWrapper>
  );
};

export default IncidentEventsPage;
