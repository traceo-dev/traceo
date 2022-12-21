import { Space, Typography } from "antd";
import { FC, ReactNode } from "react";

interface PanelHeaderProps {
  title: string | JSX.Element;
  fontSize?: number;
  subTitle?: string | JSX.Element;
  contentPadding?: number;
  suffix?: string | JSX.Element;
  backgroundColor?: string;
  icon?: JSX.Element;
  children?: ReactNode;
  showBreadcrumbs?: boolean;
  marginBottom?: boolean;
  copyBreadcrumbNames?: string[];
  extra?: ReactNode;
}

const PageHeader: FC<PanelHeaderProps> = ({
  title,
  // fontSize = 27,
  subTitle,
  contentPadding = 25,
  // children = null,
  suffix,
  backgroundColor,
  icon
  // ...props
}) => {
  const renderTitle = (
    <Space className="w-full justify-between">
      <Space>
        {icon && <div className="pr-2 text-5xl">{icon}</div>}

        <div className="inline-grid gap-0">
          <span className="pt-2 text-3xl">{title}</span>
          <span className="font-normal text-md">{subTitle}</span>
        </div>
      </Space>
      {suffix}
    </Space>
  );

  return (
    <>
      {/* <AntdPageHeader className={props.className} title={renderTitle} {...props}>
        {children}
      </AntdPageHeader> */}

      <Typography.Title className="mb-0 leading-tight">{renderTitle}</Typography.Title>

      <style>{`
        .ant-page-header {
          align-items: center;
          padding: 0;
          padding-bottom: 5px;
          background-color: ${backgroundColor ?? "transparent"};
        }

        .ant-page-header-content {
          padding-top: ${contentPadding}px;
        }
      `}</style>
    </>
  );
};

export default PageHeader;
