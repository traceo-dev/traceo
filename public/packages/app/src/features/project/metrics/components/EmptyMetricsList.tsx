import { DataNotFound } from "../../../../core/components/DataNotFound";
import { Typography } from "@traceo/ui";
import { FC } from "react";

interface Props {
  constraints?: string;
}
export const EmptyMetricsList: FC<Props> = ({ constraints }) => {
  return (
    <>
      <DataNotFound
        label="Metrics not found"
        explanation={
          constraints && (
            <Typography>
              No results for <b>{constraints}</b>
            </Typography>
          )
        }
      />
    </>
  );
};
