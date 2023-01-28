import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { joinClasses } from "../../../core/utils/classes";
import { FC } from "react";
import styled from "styled-components";
import { PaginationPositionType } from "./types";

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
  setCurrentPage: (page: number) => void;
  position: PaginationPositionType;
}
export const TablePagination: FC<TablePaginationProps> = ({
  currentPage,
  pagesCount,
  position,
  setCurrentPage
}) => {
  return (
    <div className={joinClasses("w-full mt-12 flex", mapPaginationPostion[position])}>
      <div className="border border-solid rounded border-light-secondary items-center flex flex-row max-w-min">
        <PaginationButton
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <LeftOutlined />
        </PaginationButton>
        <div className="px-5">
          <span>{currentPage}</span>
        </div>
        <PaginationButton
          disabled={currentPage === pagesCount}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          <RightOutlined />
        </PaginationButton>
      </div>
    </div>
  );
};
