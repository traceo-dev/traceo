import { LoadingOutlined } from "@ant-design/icons";
import { Space } from "core/ui-components/Space/Space";
import { FC } from "react";
import { joinClasses } from "../../core/utils/classes";

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
  children,
  className = ""
}) => {
  if (isLoading) {
    return (
      <Space className="w-full my-12 justify-center">
        <LoadingOutlined />
      </Space>
    );
  }

  if (isEmpty) {
    return <Space className={joinClasses("positoned-div", className)}>{emptyView}</Space>;
  }

  return <>{children}</>;
};
