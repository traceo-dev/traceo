import { LoadingOutlined } from "@ant-design/icons";
import { joinClasses } from "../utils/classes";
import React, { FC, useEffect, useMemo, useState } from "react";
import { Space } from "../Space";
import { Typography } from "../Typography";
import { TablePagination } from "./TablePagination";
import { TableColumn } from "./TableColumn";
import { TableRow } from "./TableRow";
import { PaginationPositionType, PageSizeType, TableRowSize } from "./types";

interface TableProps {
  children: React.ReactNode;
  collection: any[];
  className?: string;
  striped?: boolean;
  hovered?: boolean;
  loading?: boolean;
  rowSize?: TableRowSize;
  showPagination?: boolean;
  paginationPosition?: PaginationPositionType;
  pageSize?: PageSizeType;
  onRowClick?: (item: any) => void;
}
export const Table: FC<TableProps> = (props: TableProps) => {
  const {
    children,
    collection,
    className,
    striped = false,
    hovered = false,
    loading = false,
    rowSize = "md",
    onRowClick,
    pageSize = 15,
    showPagination = false,
    paginationPosition = "right",
  } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, _] = useState(pageSize);

  const pagination = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = collection?.slice(indexOfFirstItem, indexOfLastItem);

    const pagesCount = Math.ceil(collection?.length / itemsPerPage);

    return {
      currentItems,
      pagesCount,
    };
  }, [collection, pageSize, currentPage]);

  /**
   * For case when user search records via InputSearch
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [collection]);

  return (
    <div className="w-full flex flex-col">
      <table className={joinClasses("w-full text-primary", className)}>
        <thead>
          <tr>{children}</tr>
        </thead>
        {!loading && (
          <tbody className="mt-1">
            {pagination.currentItems?.map((item, index) => (
              <TableRow
                childrens={React.Children.toArray(children)}
                item={item}
                key={index}
                striped={striped}
                hovered={hovered}
                size={rowSize}
                onRowClick={() => {
                  if (onRowClick) {
                    onRowClick(item);
                  }
                }}
              />
            ))}
          </tbody>
        )}
      </table>
      {loading && (
        <Space className="py-12 justify-center w-full">
          <Typography className="pr-2">Loading</Typography>
          <LoadingOutlined />
        </Space>
      )}
      {showPagination && (
        <TablePagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          position={paginationPosition}
          pagesCount={pagination.pagesCount}
        />
      )}
    </div>
  );
};
