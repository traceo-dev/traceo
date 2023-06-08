import { LoadingOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Row } from "../Row";
import { FC, PropsWithChildren, HTMLProps } from "react";
import styled from "styled-components";
import { Tooltip } from "../Tooltip";
import { conditionClass, joinClasses } from "../utils";

const CardHeader = styled.div`
  padding: 12px;
  padding-inline: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-bg-secondary);
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-bg-secondary);
  border-radius: 2px;
  margin-bottom: 4px;
`;

const CardBody = styled.div`
  padding: 16px;
`;

export interface CardProps extends Omit<HTMLProps<HTMLElement>, "title" | "ref"> {
  icon?: JSX.Element;
  title?: string;
  extra?: JSX.Element;
  loadingContent?: boolean;
  tooltip?: string;
}
export const Card: FC<PropsWithChildren<CardProps>> = ({
  icon,
  title,
  extra,
  children,
  loadingContent = false,
  tooltip = undefined,
  onClick = undefined,
  ...props
}) => {
  return (
    <CardContainer {...props}>
      {(title || icon) && (
        <CardHeader>
          <Row gap="x-2">
            {icon}
            <span
              onClick={onClick}
              className={joinClasses(
                "text-[14px] font-semibold whitespace-nowrap",
                conditionClass(!!onClick, "cursor-pointer")
              )}
            >
              {title}
            </span>
            {tooltip && (
              <Tooltip title={tooltip}>
                <QuestionCircleOutlined className="hover:text-white cursor-pointer text-[12px]" />
              </Tooltip>
            )}
          </Row>

          {extra && extra}
        </CardHeader>
      )}
      <CardBody>{loadingContent ? <LoadingOutlined /> : children}</CardBody>
    </CardContainer>
  );
};

Card.displayName = "Card";
