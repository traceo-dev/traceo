import { QuestionCircleOutlined } from "@ant-design/icons";
import { Row, Tooltip, Typography, joinClasses } from "@traceo/ui";

interface Props {
  title: string;
  children: JSX.Element;
  className?: string;
  tooltip?: string;
}
export const Field = ({ title, children, className = "", tooltip }: Props) => {
  return (
    <div className={joinClasses("flex flex-col w-full gap-y-1 pb-3", className)}>
      <Row gap="x-2">
        <Typography size="xs" weight="semibold">
          {title}
        </Typography>
        {tooltip && (
          <Tooltip placement="top" title={tooltip}>
            <QuestionCircleOutlined className="text-primary hover:text-secondary" />
          </Tooltip>
        )}
      </Row>
      {children}
    </div>
  );
};
