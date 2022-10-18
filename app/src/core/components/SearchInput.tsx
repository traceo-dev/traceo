import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { FC } from "react";

interface Props {
  value: string;
  setValue: (val: string) => void;
  placeholder?: string;
  loading?: boolean;
}
export const SearchInput: FC<Props> = ({
  value,
  setValue,
  placeholder = "Search",
  loading = false
}) => {
  return (
    <Input.Search
      placeholder={placeholder}
      suffix={loading && <LoadingOutlined />}
      defaultValue={value}
      onSearch={setValue}
      className="w-96"
      prefix={<SearchOutlined />}
      allowClear
    />
  );
};
