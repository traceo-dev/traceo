import { LoadingOutlined } from "@ant-design/icons";
import { Space } from "@traceo/ui";
import { FC, Fragment } from "react";
import styled from "styled-components";

interface Props {
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyView?: string | JSX.Element;
  children?: any;
  className?: string;
}
export const ConditionalWrapper: FC<Props> = ({
  isLoading = false,
  isEmpty = false,
  emptyView = null,
  children
}) => {
  if (isLoading) {
    return (
      <Space className="w-full my-12 justify-center">
        <LoadingOutlined />
      </Space>
    );
  }

  if (isEmpty) {
    return <PositionedWrapper>{emptyView}</PositionedWrapper>;
  }

  return <Fragment>{children}</Fragment>;
};

const PositionedWrapper = styled.div`
  position: relative;
  margin-block: 25px;
  width: 100% !important;
  justify-content: center !important;
  text-align: center;
  padding-inline: 24%;
`;
