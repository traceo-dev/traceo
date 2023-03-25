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
                    {item.browser.browser.name} ({item.browser.browser.version})
                  </span>
                )}
              </TableColumn>
            )}
            {isBrowserSDK && (
              <TableColumn name="OS">
                {({ item }) => (
                  <span>
                    {item.browser.os.name} ({item.browser.os.version})
                  </span>
                )}
              </TableColumn>
            )}
            {isBrowserSDK && <TableColumn name="URL" value="browser.url" />}
          </Table>
        </div>
      </Card>
    </IncidentPageWrapper>
  );
};

export default IncidentEventsPage;
