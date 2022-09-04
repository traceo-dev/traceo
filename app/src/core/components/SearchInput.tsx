import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { FC } from "react";
import { joinClasses } from "../utils/classes";

interface Props {
  value: string;
  setValue: (val: string) => void;
  placeholder?: string;
  get?: () => void;
  className?: string;
  loading?: boolean;
}
export const SearchInput: FC<Props> = ({
  value,
  setValue,
  placeholder,
  get,
  className = "",
  loading = false
}) => {
  return (
    <Input
      size="middle"
      suffix={loading && <LoadingOutlined />}
      className={joinClasses("min-w-full", className)}
      placeholder={placeholder}
      style={{ width: 400 }}
      value={value}
      onChange={(val) => setValue(val.target.value)}
      prefix={<SearchOutlined />}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          get();
        }
      }}
    />
  );
};
