import { ILog } from "@traceo/types";
import dateUtils from "../../../../core/utils/date";
import styled from "styled-components";

const DetailsWrapper = styled.div`
  padding: 12px;
  border: 1px solid var(--color-bg-secondary);
  border-radius: 12px;
  font-size: 12px;
`;

interface DetailsProps {
  name: string;
  value: JSX.Element | string;
}
const DetailsRow = ({ name, value }: DetailsProps) => {
  return (
    <div className="grid grid-cols-12 font-mono pb-8 hover:bg-secondary p-3 cursor-default">
      <div className="col-span-2">{name}</div>
      <div className="col-span-10">{value}</div>
    </div>
  );
};

export const LogDetailsForm = (log: ILog) => {
  return (
    <DetailsWrapper>
      <DetailsRow name="message" value={log?.message} />
      <DetailsRow name="timestamp" value={dateUtils.formatToMs(log?.precise_timestamp)} />
    </DetailsWrapper>
  );
};
