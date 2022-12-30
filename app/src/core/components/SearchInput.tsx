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
    <>
      <Input.Search
        placeholder={placeholder}
        suffix={loading && <LoadingOutlined />}
        defaultValue={value}
        onChange={(a) => setValue(a.target.value)}
        prefix={<SearchOutlined />}
        allowClear
        className="input-class"
      />
      <style>{`
        .input-class {
          line-height: 1.5;
          font-size: 14px;
          color: rgb(204, 204, 220);
          z-index: 0;
          flex-grow: 1;
          border-radius: 6px;
          height: 100%;
          width: 100%;
        }
      `}</style>
    </>
  );
};
