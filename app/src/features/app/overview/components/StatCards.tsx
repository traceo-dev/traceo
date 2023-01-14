import { Divider, Row, Statistic } from "antd";
import { AppIncidentsStats } from "../../../../types/statistics";
import { FC } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../types/store";
import { Typography } from "core/ui-components/Typography";

interface Props {
  stats: AppIncidentsStats;
  isLoading: boolean;
}

export const StatCards: FC<Props> = ({ stats, isLoading }) => {
  const { application } = useSelector((state: StoreState) => state.application);

  return (
    <>
      <Row className="pt-3 w-full justify-flex-start pb-5 px-12">
        <Statistic
          title="Last week errors"
          className="font-semibold"
          loading={isLoading}
          value={stats?.lastWeekCount}
        />

        <Divider type="vertical" className="bg-gray-200 mx-12" />

        <Statistic
          className="font-semibold"
          loading={isLoading}
          title="All Incidents"
          value={application?.incidentsCount}
          suffix={<Typography size="xs">| {application?.errorsCount || 0}</Typography>}
        />
      </Row>
    </>
  );
};
