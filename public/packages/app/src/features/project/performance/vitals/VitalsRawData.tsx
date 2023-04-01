import { VitalsEnum, Performance } from "@traceo/types";
import { Card, Select, Table, TableColumn } from "@traceo/ui";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useRequest } from "src/core/hooks/useRequest";
import { useTimeRange } from "src/core/hooks/useTimeRange";
import { maphealthToIcon } from "./types";
import { getHealthByValue } from "./utils";
import { VitalsHealthBar } from "./VitalsHealthBar";

export const VitalsRawData = () => {
  const { id, name } = useParams();
  const { ranges, setRanges } = useTimeRange({
    from: dayjs().subtract(24, "h").unix(),
    to: dayjs().unix()
  });

  const {
    data: performances = [],
    isLoading: perfsLoading,
    execute: executePerfs
  } = useRequest<Performance[]>({
    url: `/api/performance/vitals/${id}`,
    params: {
      from: ranges[0],
      to: ranges[1],
      fields: [name]
    }
  });

  return (
    <div>
      {performances && <VitalsHealthBar list={performances} />}
      <Card title="Raw data">
        <Table
          collection={performances}
          loading={perfsLoading}
          pageSize={15}
          showPagination
          striped
          rowSize="md"
        >
          <TableColumn name="HEALTH">
            {({ item }) => maphealthToIcon[getHealthByValue(name as VitalsEnum, item.value)]}
          </TableColumn>
          <TableColumn name="TIME" value="receive_timestamp" />
          <TableColumn name="VALUE" value="value" />
          {name !== VitalsEnum.CLS && <TableColumn name="UNIT" value="unit" />}
          <TableColumn name="EVENT" value="event" />
          <TableColumn name="BROWSER">
            {({ item }) => {
              if (!item["browser_name"]) {
                return "-";
              }

              return (
                <span>
                  {item["browser_name"]} ({item["browser_version"]})
                </span>
              );
            }}
          </TableColumn>
          <TableColumn name="PLATFORM" value="platform_type" />
          <TableColumn name="VIEW" value="view" />
        </Table>
      </Card>
    </div>
  );
};
