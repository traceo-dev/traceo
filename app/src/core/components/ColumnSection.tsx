import { Col, Divider, Row, Space, Typography } from "antd";
import { FC } from "react";

interface Props {
  marginTop?: number;
  firstColumnWidth?: number;
  secondColumnWidth?: number;
  title: string | JSX.Element;
  subtitle?: string | JSX.Element;
  className?: string;
  divider?: boolean;
  hidden?: boolean;
}

export const ColumnSection: FC<Props> = ({
  marginTop = 55,
  firstColumnWidth = 10,
  secondColumnWidth = 14,
  title,
  subtitle,
  children,
  className,
  divider,
  hidden = false
}) => {
  return (
    !hidden && (
      <div className={className} style={{ marginTop: `${marginTop}px` }}>
        <Row gutter={[24, 0]}>
          <Col span={24} md={firstColumnWidth}>
            <Typography className="text-xl font-normal">{title}</Typography>
            <Space style={{ maxWidth: "430px" }}>
              <Typography className="text-sm">{subtitle}</Typography>
            </Space>
          </Col>
          <Col span={24} md={secondColumnWidth} className="self-end">
            {children}
          </Col>
        </Row>

        {divider && <Divider />}
      </div>
    )
  );
};
