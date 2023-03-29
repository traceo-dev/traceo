import { DataNotFound } from "../../../core/components/DataNotFound";
import { Typography } from "@traceo/ui";
import { FC } from "react";

interface Props {
  constraints?: string;
}
export const EmptyProjectsList: FC<Props> = ({ constraints }) => {
  return (
    <DataNotFound
      className="text-2xl mt-12"
      label="Projects not found"
      explanation={
        constraints ? (
          <Typography>
            No results for <b>{constraints}</b>
          </Typography>
        ) : (
          <Typography>Contact the administrator and start monitoring projects.</Typography>
        )
      }
    />
  );
};
