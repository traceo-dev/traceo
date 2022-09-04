import { Card, Skeleton, Space, Typography } from "antd";
import { FC } from "react";
import { joinClasses } from "../utils/classes";

interface Props {
  title: string;
  children: any;
  isLoading?: boolean;
  extra?: JSX.Element;
  className?: string;
  icon?: JSX.Element;
}
export const PanelCard: FC<Props> = ({
  children,
  title = "",
  isLoading = false,
  className,
  icon
}) => {
  return (
    <>
      <Card className={joinClasses("panel-card", className)}>
        {isLoading ? (
          <Skeleton />
        ) : (
          <Space className="w-full">
            <div className="text-5xl mr-8 text-secondary">{icon}</div>
            <Space direction="vertical" className="text-left justify-start gap-0">
              <Typography.Text>{title}</Typography.Text>
              {children}
            </Space>
          </Space>
        )}
      </Card>
      <style>{`
        .panel-card {
          background-color: var(--color-bg-primary);
          border: 1px solid rgba(204, 204, 220, 0.07);
          border-radius: 4px;
          box-shadow: rgb(24 26 27 / 75%) 0px 1px 2px;
          text-align: inherit;
          justify-content: inherit;
          border-left: 4px solid orange;
        }
        
        .panel-card .ant-card-head {
          min-height: unset !important;
        }
        
        .panel-card > .ant-card-head .ant-card-head-wrapper .ant-card-head-title {
          font-size: 14px !important;
          padding: 8px 0px !important;
          min-height: unset !important;
        }
        
        .panel-card > .ant-card-head .ant-card-head-wrapper .ant-card-extra {
          padding: 8px 0px !important;
        }
      `}</style>
    </>
  );
};
