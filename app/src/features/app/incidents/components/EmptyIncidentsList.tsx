import { Typography } from "antd";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { FC } from "react";

interface Props {
  constraints?: string;
}
export const EmptyIncidentsList: FC<Props> = ({ constraints }) => {
  return (
    <>
      <DataNotFound
        className="text-2xl mt-12"
        label="Incidents not found"
        explanation={
          constraints ? (
            <Typography.Text>
              No results for <b>{constraints}</b>
            </Typography.Text>
          ) : (
            <Typography.Text>
              Great! You have nothing to worry about for now!
            </Typography.Text>
          )
        }
      />
    </>
  );
};
