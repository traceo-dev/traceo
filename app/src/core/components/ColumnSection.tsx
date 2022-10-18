import { Col, Row, Space, Typography } from "antd";
import { FC } from "react";

interface Props {
  marginTop?: number;
  firstColumnWidth?: number;
  secondColumnWidth?: number;
  title?: string | JSX.Element;
  subtitle?: string | JSX.Element;
  className?: string;
  hidden?: boolean;
}

export const ColumnSection: FC<Props> = ({
  firstColumnWidth = 10,
  secondColumnWidth = 14,
  title,
  subtitle,
  children,
  className,
  hidden = false
}) => {
  return (
    !hidden && (
      <div className={className}>
        <Row gutter={[24, 0]}>
          <Col span={24} md={firstColumnWidth}>
            <Typography className="text-xl font-semibold">{title}</Typography>
            <Space className="w-96">
              <Typography className="text-sm">{subtitle}</Typography>
            </Space>
          </Col>
          <Col span={24} md={secondColumnWidth} className="self-end">
            {children}
          </Col>
        </Row>
      </div>
    )
  );
};
