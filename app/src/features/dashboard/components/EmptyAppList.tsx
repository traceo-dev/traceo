import { DataNotFound } from "../../../core/components/DataNotFound";
import { FC } from "react";
import { Typography } from "core/ui-components/Typography";

interface Props {
  constraints?: string;
}
export const EmptyAppList: FC<Props> = ({ constraints }) => {
  return (
    <DataNotFound
      className="text-2xl mt-12"
      label="Applications not found"
      explanation={
        constraints ? (
          <Typography>
            No results for <b>{constraints}</b>
          </Typography>
        ) : (
          <Typography>
            Contact the administrator and start monitoring the applications.
          </Typography>
        )
      }
    />
  );
};
