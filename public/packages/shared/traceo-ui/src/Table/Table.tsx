import { Space } from "../Space";
import { Typography } from "../Typography";
import { TablePagination } from "./TablePagination";
import { TableRow } from "./TableRow";
import { PaginationPositionType, PageSizeType, TableRowSize } from "./types";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import React, { FC, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

const TableWrapper = styled.table`
  border: 2px solid var(--color-bg-secondary);
  width: 100%;
`;

const TableThead = styled.thead`
  color: #ffffff;
  background-color: var(--color-bg-secondary);
`;

const TableTbody = styled.tbody`
  margin-top: 4px;
`;

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
  emptyLabel?: string;
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
    emptyLabel = "Not found"
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
      pagesCount
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
      <TableWrapper className={className}>
        <TableThead>
          <tr>{children}</tr>
        </TableThead>
        {!loading && (
          <TableTbody>
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
          </TableTbody>
        )}
      </TableWrapper>
      {loading && (
        <Space className="py-12 justify-center w-full">
          <Typography className="pr-2">Loading</Typography>
          <LoadingOutlined />
        </Space>
      )}
      {!loading && (!collection || collection.length === 0) && (
        <Space className="py-12 justify-center flex flex-col w-full">
          <SearchOutlined className="text-2xl" />
          <Typography className="font-semibold">{emptyLabel}</Typography>
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
