import { PageHeader as AntdPageHeader, Space } from "antd";
import { PageHeaderProps } from "antd/es/page-header";
import { FC } from "react";

interface PanelHeaderProps extends PageHeaderProps {
  title: string | JSX.Element;
  fontSize?: number;
  subTitle?: string | JSX.Element;
  contentPadding?: number;
  suffix?: string | JSX.Element;
  backgroundColor?: string;
  icon?: JSX.Element;
}

const PageHeader: FC<PanelHeaderProps> = ({
  title,
  fontSize = 27,
  subTitle,
  contentPadding = 25,
  children = null,
  suffix,
  backgroundColor,
  icon,
  ...props
}) => {
  const renderTitle = (
    <Space className="w-full justify-between">
      <Space>
        {icon && (
          <div className="pr-2" style={{ fontSize: "56px" }}>
            {icon}
          </div>
        )}

        <div className="inline-grid gap-0">
          <span style={{ fontSize }} className="pt-2">
            {title}
          </span>
          <span style={{ fontSize: "14px" }} className="font-normal">
            {subTitle}
          </span>
        </div>
      </Space>
      {suffix}
    </Space>
  );

  return (
    <>
      <AntdPageHeader className={props.className} title={renderTitle} {...props}>
        {children}
      </AntdPageHeader>
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
