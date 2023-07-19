import { joinClasses } from "../utils/classes";
import { PaginationPositionType } from "./types";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { FC } from "react";
import { Row } from "../Row";
import styled from "styled-components";

const PaginationButton = styled.div`
  padding: 8px;
  border-radius: 3px;
  cursor: pointer;
  background-color: transparent;
  &:hover {
    background-color: var(--color-bg-light-secondary);
  }
  ${({ isDisabled }) => {
    if (isDisabled) {
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
    <Row className={joinClasses("w-full mt-12", mapPaginationPostion[position])}>
      {!!totalRowsCount && (
        <span className="text-xs whitespace-nowrap pr-5">
          Showing {pageSize * (currentPage - 1)}-{pageSize * currentPage} from {totalRowsCount}{" "}
          rows
        </span>
      )}
      <Row className="text-xs border border-solid rounded border-light-secondary max-w-min">
        <PaginationButton
          isDisabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <LeftOutlined />
        </PaginationButton>
        <div className="px-5">
          <span>{currentPage}</span>
        </div>
        <PaginationButton
          isDisabled={currentPage === pagesCount || totalRowsCount === 0 || !totalRowsCount}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <RightOutlined />
        </PaginationButton>
      </Row>
    </Row>
  );
};
