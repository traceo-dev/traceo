import { joinClasses } from "core/utils/classes";
import React, { FC } from "react";
import { TableRow, TableRowSize } from "./TableRow";

interface TableProps {
  children: React.ReactNode;
  collection: any[];
  className?: string;
  striped?: boolean;
  hovered?: boolean;
  rowSize?: TableRowSize;
  onRowClick?: (item: any) => void;
}
export const Table: FC<TableProps> = (props: TableProps) => {
  const {
    children,
    collection,
    className,
    striped = false,
    hovered = false,
    rowSize = "md",
    onRowClick
  } = props;

  return (
    <table className={joinClasses("w-full text-primary", className)}>
      <thead>
        <tr>{children}</tr>
      </thead>
      <tbody className="mt-1">
        {collection?.map((item, index) => (
          <TableRow
            childrens={React.Children.toArray(children)}
            item={item}
            key={index}
            striped={striped}
            hovered={hovered}
            size={rowSize}
            onRowClick={() => onRowClick(item)}
          />
        ))}
      </tbody>
    </table>
  );
};
