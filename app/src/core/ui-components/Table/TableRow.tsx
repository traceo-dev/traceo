import { joinClasses, conditionClass } from "core/utils/classes";
import React, { FC } from "react";
import { getTraversValue } from "./utils";

export type TableRowSize = "md" | "lg";
interface TableRowProps {
  item: any;
  childrens: React.ReactNode[];
  striped?: boolean;
  hovered?: boolean;
  size?: TableRowSize;
  onRowClick?: () => void;
}
export const TableRow: FC<TableRowProps> = ({
  item,
  childrens,
  striped,
  hovered,
  size,
  onRowClick
}) => {
  const mapRowSizeStyle: Record<TableRowSize, string> = {
    md: "py-2 px-3 leading-6 h-7 text-[13px]",
    lg: "py-4 px-3 leading-7 h-8 text-[16px]"
  };
  return (
    <tr
      onClick={onRowClick}
      className={joinClasses(
        conditionClass(
          striped,
          "odd:bg-secondary",
          "border-t border-b-0 border-l-0 border-r-0 border-solid border-light-secondary"
        ),
        conditionClass(hovered, "hover:bg-light-secondary duration-200"),
        conditionClass(!!onRowClick, "cursor-pointer")
      )}
    >
      {childrens.map((child, index) => {
        if (!React.isValidElement(child)) {
          return child;
        }

        return (
          <td
            key={index}
            className={joinClasses(mapRowSizeStyle[size], child.props.className)}
          >
            {child.props.children
              ? child.props.children({ item })
              : getTraversValue(item, child.props.value)}
          </td>
        );
      })}
    </tr>
  );
};
