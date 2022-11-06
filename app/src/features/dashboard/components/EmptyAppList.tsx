import { Typography } from "antd";
import { DataNotFound } from "../../../core/components/DataNotFound";
import { FC } from "react";

interface Props {
  constraints?: string;
}
export const EmptyAppList: FC<Props> = ({ constraints }) => {
  return (
    <>
      <DataNotFound
        className="text-2xl mt-12"
        label="Applications not found"
        explanation={
          constraints ? (
            <Typography.Text>
              No results for <b>{constraints}</b>
            </Typography.Text>
          ) : (
            <Typography.Text>
              Contact the administrator and start monitoring the applications.
            </Typography.Text>
          )
        }
      />
    </>
  );
};
