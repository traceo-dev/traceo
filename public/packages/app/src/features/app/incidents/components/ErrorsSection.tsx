import dateUtils from "../../../../core/utils/date";
import { StoreState } from "@store/types";
import { Card, Table, TableColumn } from "@traceo/ui";
import { useSelector } from "react-redux";
import { SDK } from "@traceo/types";

export const ErrorsSection = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);

  return (
    <Card title="Errors" className="h-auto">
      <div className="h-64 overflow-y-scroll">
        <Table collection={incident?.errorsDetails} hovered>
          <TableColumn name="Time" className="py-5">
            {({ item }) => dateUtils.formatDate(item?.date, "DD MMM YYYY HH:mm:ss:mmm")}
          </TableColumn>
          {incident.sdk === SDK.REACT && (
            <TableColumn name="Browser">
              {({ item }) => (
                <span>
                  {item.browser.browser.name} ({item.browser.browser.version})
                </span>
              )}
            </TableColumn>
          )}
          {incident.sdk === SDK.REACT && (
            <TableColumn name="OS">
              {({ item }) => (
                <span>
                  {item.browser.os.name} ({item.browser.os.version})
                </span>
              )}
            </TableColumn>
          )}
          {incident.sdk === SDK.REACT && <TableColumn name="URL" value="browser.url" />}
        </Table>
      </div>
    </Card>
  );
};
