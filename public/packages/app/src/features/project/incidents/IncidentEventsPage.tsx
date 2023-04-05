import { useAppDispatch } from "../../../store";
import { StoreState } from "../../../store/types";
import { BROWSER_SDK } from "@traceo/types";
import { Card, Table, TableColumn } from "@traceo/ui";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import dateUtils from "../../../core/utils/date";
import IncidentPageWrapper from "./components/IncidentPageWrapper";
import { loadIncidentEvents } from "./state/actions";

const IncidentEventsPage = () => {
  const dispatch = useAppDispatch();
  const { incident } = useSelector((state: StoreState) => state.incident);
  const { events, isLoading } = useSelector((state: StoreState) => state.events);

  const isBrowserSDK = BROWSER_SDK.includes(incident.sdk);

  useEffect(() => {
    dispatch(loadIncidentEvents(incident.id));
  }, []);

  return (
    <IncidentPageWrapper>
      <Card className="h-auto">
        <Table striped showPagination pageSize={25} collection={events} loading={isLoading}>
          <TableColumn name="Time" className="py-5">
            {({ item }) => dateUtils.formatDate(item?.date, "DD MMM YYYY HH:mm:ss:mmm")}
          </TableColumn>
          {isBrowserSDK && (
            <TableColumn name="Browser">
              {({ item }) => (
                <span>
                  {item.details?.browser?.name} ({item.details?.browser?.version})
                </span>
              )}
            </TableColumn>
          )}
          {isBrowserSDK && (
            <TableColumn name="OS">
              {({ item }) => (
                <span>
                  {item.details?.os?.name} ({item.details?.os?.version})
                </span>
              )}
            </TableColumn>
          )}
          {isBrowserSDK && (
            <TableColumn name="Platform">
              {({ item }) => <span>{item.details?.platform?.type}</span>}
            </TableColumn>
          )}
          {isBrowserSDK && (
            <TableColumn name="URL">{({ item }) => <span>{item.details?.url}</span>}</TableColumn>
          )}
        </Table>
      </Card>
    </IncidentPageWrapper>
  );
};

export default IncidentEventsPage;
