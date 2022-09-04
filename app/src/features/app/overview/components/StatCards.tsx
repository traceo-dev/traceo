import { Divider, Row, Statistic, Typography } from "antd";
import { TextLabel } from "src/core/components/TextLabel";
import { ApplicationStats } from "src/types/statistics";
import { FC } from "react";

interface Props {
  stats: ApplicationStats;
  isLoading: boolean;
}

export const StatCards: FC<Props> = ({ stats, isLoading }) => {
  return (
    <>
      <Row className="pt-3 w-full justify-flex-start pb-5 px-12">
        <Statistic
          title={
            <TextLabel
              className="font-medium"
              label="Last week"
              hint="Number of incidents captured by Traceo SDK in the last week"
            />
          }
          className="font-semibold"
          value={stats?.total?.lastWeek}
        />

        <Divider type="vertical" className="bg-gray-200 mx-12" />

        <Statistic
          className="font-semibold"
          loading={isLoading}
          title={
            <TextLabel
              className="font-medium"
              label="Total incidents"
              hint="Number of incidents captured by Traceo SDK in this app. Big number is a count of main incidents while small number is a number of occurrences of main incidents"
            />
          }
          value={stats?.total?.incidentsCount}
          suffix={
            <Typography className="text-xs">
              | {stats?.total?.incidentsOccurCount || 0}
            </Typography>
          }
        />
        {/* <Divider type="vertical" className="bg-gray-200" />
        <Statistic
          className="font-semibold"
          loading={isLoading}
          title={<TextLabel className="font-medium" label="Current release version" />}
          value={stats?.release?.version || "N/A"}
        />
        <Divider type="vertical" className="bg-gray-200" />
        <Statistic
          className="font-semibold"
          loading={isLoading}
          title={
            <TextLabel
              className="font-medium"
              label="Current release incidents"
              hint="Number of incidents in current release. Big number is a count of main incidents while small number is a number of occurrences of main incidents"
            />
          }
          value={stats?.release?.incidentsCount}
          suffix={
            <Typography className="text-xs">
              | {stats?.release?.incidentsOccurCount || 0}
            </Typography>
          }
        /> */}
      </Row>
    </>
  );
};
