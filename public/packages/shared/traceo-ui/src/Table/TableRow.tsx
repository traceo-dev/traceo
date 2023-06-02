import { joinClasses, conditionClass } from "../utils/classes";
import { TableRowSize } from "./types";
import { getTraversValue } from "./utils";
import React, { FC } from "react";

const mapRowSizeStyle: Record<TableRowSize, string> = {
  md: "py-3 px-3 leading-6 h-7 text-[13px]",
  lg: "py-4 px-3 leading-7 h-8 text-[16px]"
};

interface TableRowProps {
  item: any;
  childrens: React.ReactNode[];
  striped?: boolean;
  hovered?: boolean;
  size?: TableRowSize;
  onRowClick?: (item: any) => void;
  scrollable?: boolean;
}
export const TableRow: FC<TableRowProps> = ({
  item,
  childrens,
  striped = true,
  hovered = false,
  size = "md",
  onRowClick,
  scrollable = false
}) => {
  const handleOnClick = (e) => {
    e.preventDefault();
    onRowClick(item);
  };

  return (
    <tr
      onClick={handleOnClick}
      className={joinClasses(
        conditionClass(
          striped,
          "even:bg-secondary",
          "border-b border-t-0 border-l-0 border-r-0 border-solid border-light-secondary"
        ),
        conditionClass(hovered, "hover:bg-secondary duration-200"),
        conditionClass(!!onRowClick, "cursor-pointer"),
        conditionClass(scrollable, "table w-full table-fixed")
      )}
    >
      {childrens.map((child, index) => {
        if (!React.isValidElement(child)) {
          return child;
        }

        return (
          <td key={index} className={joinClasses(mapRowSizeStyle[size], child.props.className)}>
            {child.props.children
              ? child.props.children({ item })
              : getTraversValue(item, child.props.value)}
          </td>
        );
      })}
    </tr>
  );
};
