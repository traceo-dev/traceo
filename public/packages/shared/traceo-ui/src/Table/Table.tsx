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
  rowsCount?: number;
  currentPage?: number;
  onRowClick?: (item: any) => void;
  onPageChange?: (page: number) => void;
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
    onPageChange,
    pageSize = 15,
    currentPage = 1,
    rowsCount = undefined,
    showPagination = false,
    paginationPosition = "right",
    emptyLabel = "Not found"
  } = props;

  const [page, setPage] = useState(currentPage);
  const [itemsPerPage, _] = useState(pageSize);

  const pagination = useMemo(() => {
    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    /**
     * When there is onPageChange then we know that data is fetching before trigger this function.
     * In this case we have to use full collection. Slice is doing when pagination is made on raw result
     * without pagination from API.
     */
    const currentItems = onPageChange
      ? collection
      : collection?.slice(indexOfFirstItem, indexOfLastItem);

    const totalItemsCount = rowsCount ?? collection?.length;
    const pagesCount = Math.ceil(totalItemsCount / itemsPerPage);

    return {
      currentItems,
      pagesCount
    };
  }, [collection, pageSize, currentPage, page]);

  useEffect(() => {
    setPage(currentPage);
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
          currentPage={page}
          setCurrentPage={setPage}
          position={paginationPosition}
          pagesCount={pagination.pagesCount}
          onPageChange={onPageChange}
          totalRowsCount={rowsCount}
          pageSize={pageSize}
        />
      )}
    </div>
  );
};
