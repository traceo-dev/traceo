import { ILog } from "@traceo/types";
import { Col, Typography } from "@traceo/ui";
import { Field } from "../components/Field";

export const LogDetailsForm = (log: ILog) => {
  return (
    <Col className="gap-y-4">
      <Field title="Message">{<Typography>{log?.message}</Typography>}</Field>
      <Field title="Timestamp">{<Typography>{log?.timestamp}</Typography>}</Field>
    </Col>
  );
};
