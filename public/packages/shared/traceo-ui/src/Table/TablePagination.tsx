import { joinClasses } from "../utils/classes";
import { PaginationPositionType } from "./types";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { FC } from "react";
import styled from "styled-components";

const PaginationButton = styled.div`
  padding: 8px;
  border-radius: 3px;
  cursor: pointer;
  background-color: transparent;
  &:hover {
    background-color: var(--color-bg-light-secondary);
  }
  ${({ disabled }) => {
    if (disabled) {
      return `
        pointer-events: none;
        opacity: 25%;
      `;
    }
  }}
`;

const mapPaginationPostion: Record<PaginationPositionType, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end"
};

interface TablePaginationProps {
  currentPage: number;
  pagesCount: number;
  totalRowsCount?: number;
  pageSize?: number;
  setCurrentPage: (page: number) => void;
  position: PaginationPositionType;
  onPageChange?: (page: number) => void;
}
export const TablePagination: FC<TablePaginationProps> = ({
  currentPage,
  totalRowsCount = undefined,
  pageSize,
  pagesCount,
  position,
  setCurrentPage,
  onPageChange
}) => {
  const handlePageChange = (page: number) => {
    onPageChange && onPageChange(page);
    setCurrentPage(page);
  };
  return (
    <div
      className={joinClasses(
        "w-full mt-12 flex flex-row items-center",
        mapPaginationPostion[position]
      )}
    >
      {totalRowsCount && (
        <span className="text-xs whitespace-nowrap pr-5">
          Showing {pageSize * (currentPage - 1)}-{pageSize * currentPage} from {totalRowsCount} rows
        </span>
      )}
      <div className="border border-solid rounded border-light-secondary items-center flex flex-row max-w-min">
        <PaginationButton
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <LeftOutlined />
        </PaginationButton>
        <div className="px-5">
          <span>{currentPage}</span>
        </div>
        <PaginationButton
          disabled={currentPage === pagesCount}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <RightOutlined />
        </PaginationButton>
      </div>
    </div>
  );
};
