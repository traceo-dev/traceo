import { QuestionCircleOutlined } from "@ant-design/icons";
import { Space, Tooltip, Typography } from "antd";
import { FC } from "react";

interface Props {
  label: string;
  hint?: string;
  className?: string;
}
export const TextLabel: FC<Props> = ({ label, hint, className }) => {
  return (
    <>
      <Space>
        <Typography className={className}>{label}</Typography>
        {hint && (
          <Tooltip className="text-cyan-700 cursor-pointer" title={hint}>
            <QuestionCircleOutlined className="hint-hover" />
          </Tooltip>
        )}
      </Space>
      <style>{`
        .hint-hover:hover {
          color: #000000;
          transition: 0.1s;
        }
      `}</style>
    </>
  );
};
