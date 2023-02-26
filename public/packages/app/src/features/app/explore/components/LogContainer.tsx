import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { TraceoLog } from "@traceo/types";
import { Space } from "@traceo/ui";
import { useState } from "react";
import { DescriptionRow, Descriptions } from "../../../../core/components/Descriptions";
import { mapLogColor } from "./utils";

export const LogContainer = ({ children }) => {
  return <ul className="w-full block overflow-y-scroll h-80 pl-0">{children}</ul>;
};

export const LogRow = (log: TraceoLog) => {
  const [isSelected, setSelected] = useState<boolean>(false);

  const logExpandIconClassname = "p-1 bg-secondary rounded";
  return (
    <>
      <LogWrapper isSelected={isSelected} onClick={() => setSelected(!isSelected)}>
        <span className="col-span-2">
          {isSelected ? (
            <MinusOutlined className={logExpandIconClassname} />
          ) : (
            <PlusOutlined className={logExpandIconClassname} />
          )}
          <span className="pl-5">{log.timestamp}</span>
        </span>
        <span className="col-span-10 ml-5">
          <div className="whitespace-nowrap overflow-hidden text-ellipsis inline-block">
            <span className={mapLogColor[log.level]}>[{log.level.toUpperCase()}]</span>{" "}
            {log.message}
          </div>
        </span>
      </LogWrapper>
      {isSelected && <LogDetails {...log} />}
    </>
  );
};

const LogDetails = (log: TraceoLog) => {
  return (
    <Space
      direction="vertical"
      className="text-xs p-3 w-full rounded-md border border-solid border-light-secondary"
    >
      <Descriptions>
        <DescriptionRow label="Message">{log.message}</DescriptionRow>
        <DescriptionRow label="Timestamp">{log.timestamp}</DescriptionRow>
        <DescriptionRow label="Level">{log.level}</DescriptionRow>
      </Descriptions>
    </Space>
  );
};

const LogWrapper = styled.li`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace !important;
  cursor: pointer;
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;
  font-size: 0.75rem;
  line-height: 1rem;

  &:hover {
    background-color: var(--color-bg-secondary);
  }

  ${({ isSelected }) => {
    if (isSelected) {
      return `background-color: var(--color-bg-secondary)`;
    }
  }}
`;
