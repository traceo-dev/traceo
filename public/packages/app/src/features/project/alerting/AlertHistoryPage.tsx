import { Card, Table, TableColumn } from "@traceo/ui";
import AlertPageWrapper from "./components/AlertPageWrapper";
import { useReactQuery } from "../../../core/hooks/useReactQuery";
import { useParams } from "react-router-dom";
import { IAlertHistory, PaginateType } from "@traceo/types";
import { useState } from "react";
import dateUtils from "../../../core/utils/date";

const ALERT_HISTORY_PAGE_SIZE = 15;
const AlertHistoryPage = () => {
  const { aid } = useParams();
  const [page, setPage] = useState<number>(1);

  const { data: response, isLoading } = useReactQuery<PaginateType<IAlertHistory[]>>({
    queryKey: ["alert-history"],
    url: `/api/alert/history`,
    params: {
      alertId: aid
    }
  });

  return (
    <AlertPageWrapper>
      <Card>
        <Table
          showPagination
          striped
          collection={response?.result}
          rowsCount={response?.totalCount}
          loading={isLoading}
          currentPage={page}
          pageSize={ALERT_HISTORY_PAGE_SIZE}
        >
          <TableColumn name="Reason" value="reason" />
          <TableColumn name="Triggered at">
            {({ item }) => (
              <span>{dateUtils.formatDate(item.triggeredAt, "DD-MM-YYYY HH:mm")}</span>
            )}
          </TableColumn>
        </Table>
      </Card>
    </AlertPageWrapper>
  );
};

export default AlertHistoryPage;
