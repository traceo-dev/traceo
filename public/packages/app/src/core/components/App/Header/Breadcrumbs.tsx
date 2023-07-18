import { Row, Avatar, conditionClass } from "@traceo/ui";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { StoreState } from "../../../../store/types";
import styled, { css } from "styled-components";
import { getActiveRoute } from "../utils";
import { useProject } from "../../../../core/hooks/useProject";
import { useMemo } from "react";

const StartBreadcrumb = styled.div<{ isSingle: boolean }>`
  display: flex;
  user-select: none;
  font-weight: 500;
  text-align: center;
  vertical-align: baseline;
  font-size: 0.8rem;
  background-color: rgb(22 78 99);
  color: #ffffff;
  line-height: 16px;
  padding-block: 3px;
  padding-inline: 12px 16px;
  max-inline-size: 160px;
  border-start-start-radius: 6px;
  border-end-start-radius: 6px;
  cursor: pointer;

  &:hover {
    color: #ffffff;
  }

  ${(props) =>
    props.isSingle
      ? css`
          padding-inline: 12px 12px;
          border-start-end-radius: 6px;
          border-end-end-radius: 6px;
        `
      : css`
          clip-path: polygon(
            0px 0px,
            calc(100% - 8px) 0px,
            100% 50%,
            calc(100% - 8px) 100%,
            0px 100%
          );
        `}
`;

const EndBreadcrumb = styled.div`
  display: flex;
  font-weight: 500;
  text-align: center;
  vertical-align: baseline;
  font-size: 0.8rem;
  background-color: rgb(14 116 144);
  color: #ffffff;
  line-height: 16px;
  padding-block: 3px;
  padding-inline: 16px 12px;
  border-start-end-radius: 6px;
  border-end-end-radius: 6px;
  clip-path: polygon(0px 0px, 100% 0px, 100% 100%, 0px 100%, 8px 50%);
  cursor: text;
`;

// const MiddleBreadcrumb = styled.div`
//   user-select: text;
//   font-weight: 500;
//   text-align: center;
//   vertical-align: baseline;
//   font-size: 0.8571rem;
//   background-color: var(--color-bg-secondary);
//   color: var(--color-text-primary);
//   clip-path: polygon(
//     0px 0px,
//     calc(100% - 8px) 0px,
//     100% 50%,
//     calc(100% - 8px) 100%,
//     0px 100%,
//     8px 50%
//   );
//   line-height: 16px;
//   padding-block: 4px;
//   padding-inline: 16px;
//   max-inline-size: 160px;
//   overflow: hidden !important;
//   text-overflow: ellipsis !important;
//   white-space: nowrap !important;
// `;

interface Props {
  isShift: boolean;
}
export const Bradcrumbs = ({ isShift }: Props) => {
  const location = useLocation();
  const navTree = useSelector((state: StoreState) => state.navTree.navTree);
  const { project } = useProject();

  const activeNode = useMemo(
    () => getActiveRoute(navTree, location.pathname),
    [navTree, location]
  );

  const isProject = activeNode.mainItem && activeNode.mainItem.url.split("/").includes("project");

  if (!activeNode || !activeNode.mainItem) {
    return null;
  }

  const shift = isShift && isProject;

  return (
    <Row className="ml-3 items-center text-sm">
      <Avatar
        className={conditionClass(shift, "show-logo", "hide-logo")}
        shape="square"
        size="sm"
        alt={project?.name}
        src={project?.gravatar}
      />

      <Row className={conditionClass(shift, "show-logo-breadcrumb", "hide-logo-breadcrumb")}>
        <Link to={activeNode.mainItem.url}>
          <StartBreadcrumb isSingle={!activeNode.subItem}>
            {activeNode.mainItem.label}
          </StartBreadcrumb>
        </Link>
        {activeNode.subItem && (
          <Link to={activeNode.subItem.url}>
            <EndBreadcrumb>{activeNode.subItem.label}</EndBreadcrumb>
          </Link>
        )}
      </Row>
    </Row>
  );
};
