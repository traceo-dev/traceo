import { QuestionCircleOutlined } from "@ant-design/icons";
import { Tooltip, joinClasses } from "@traceo/ui";

interface Props {
  title: string;
  children: JSX.Element;
  className?: string;
  tooltip?: string;
}
export const OptionField = ({ title, children, className = "", tooltip }: Props) => {
  return (
    <div className={joinClasses("flex flex-col w-full pb-3", className)}>
      <div className="flex flex-row items-center gap-x-2">
        <label className="text-[12px] font-semibold py-1">{title}</label>
        {tooltip && (
          <Tooltip placement="top" title={tooltip}>
            <QuestionCircleOutlined className="text-primary hover:text-secondary" />
          </Tooltip>
        )}
      </div>
      {children}
    </div>
  );
};
