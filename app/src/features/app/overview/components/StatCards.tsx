import { Divider, Row, Statistic, Typography } from "antd";
import { TextLabel } from "../../../../core/components/TextLabel";
import { AppIncidentsStats } from "../../../../types/statistics";
import { FC } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../types/store";

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
          title={
            <TextLabel
              className="font-medium"
              label="Last week"
              hint="Number of errors captured by Traceo SDK in the last week"
            />
          }
          className="font-semibold"
          loading={isLoading}
          value={stats?.lastWeekCount}
        />

        <Divider type="vertical" className="bg-gray-200 mx-12" />

        <Statistic
          className="font-semibold"
          loading={isLoading}
          title={
            <TextLabel
              className="font-medium"
              label="All Incidents"
              hint="Number of incidents captured by Traceo SDK in this app. Big number is a count of main incidents while small number is a total number of errors."
            />
          }
          value={application?.incidentsCount}
          suffix={
            <Typography className="text-xs">| {application?.errorsCount || 0}</Typography>
          }
        />
      </Row>
    </>
  );
};
