import { LeftOutlined } from "@ant-design/icons";
import { Row, Space, Typography, conditionClass } from "@traceo/ui";
import { NavigateFunction, NavigateOptions, To, useNavigate } from "react-router-dom";

interface Props {
  page?: string;
  title: JSX.Element | string;
  description: JSX.Element | string;
  backOpts?: To;
}
export const PreviewPageHeader = ({ description, page, title, backOpts }: Props) => {
  const navigate = useNavigate();

  return (
    <Space direction="vertical" className="gap-0 w-full">
      <span className="text-[9px] uppercase">
        <Row
          gap="x-2"
          className={conditionClass(!!backOpts, "cursor-pointer")}
          onClick={() => backOpts && navigate(backOpts)}
        >
          {backOpts && <LeftOutlined />}
          {page}
        </Row>
      </span>
      <span className="text-3xl font-semibold leading-7">{title}</span>
      {typeof description === "string" ? (
        <Typography className="pt-2">{description}</Typography>
      ) : (
        description
      )}
    </Space>
  );
};
