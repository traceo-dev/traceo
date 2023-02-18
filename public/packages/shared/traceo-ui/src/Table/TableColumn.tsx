import { FC } from "react";

interface TableColumnProps {
  name?: string;
  value?: string;
  width?: number;
  children?: (props?: { item: any }) => React.ReactNode;
  className?: string;
}

export const TableColumn: FC<TableColumnProps> = ({ name, width }) => {
  return (
    <th
      style={{ width }}
      className="text-2xs text-start font-bold h-5 leading-6 py-2 px-3 uppercase"
    >
      {name}
    </th>
  );
};
