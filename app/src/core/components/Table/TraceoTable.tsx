import { FC } from "react";

interface TraceoTableProps {
  columns?: string[];
  children: JSX.Element[];
}
export const TraceoTable: FC<TraceoTableProps> = ({ columns, children }) => {
  return (
    <>
      <table className="details-table">
        <thead className="details-table-thead">
          <tr>
            {columns?.map((column) => (
              <th>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
      <style>{`
          .details-table-thead tr th {
            text-align: left;
            font-weight: 400;
          }
        `}</style>
    </>
  );
};
