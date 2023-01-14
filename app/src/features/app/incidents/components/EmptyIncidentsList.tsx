import { DataNotFound } from "../../../../core/components/DataNotFound";
import { FC } from "react";
import { Typography } from "core/ui-components/Typography";

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
            <Typography>
              No results for <b>{constraints}</b>
            </Typography>
          ) : (
            <Typography>Great! You have nothing to worry about for now!</Typography>
          )
        }
      />
    </>
  );
};
