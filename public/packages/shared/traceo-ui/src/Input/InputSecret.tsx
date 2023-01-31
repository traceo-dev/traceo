import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { forwardRef, HTMLProps, useState } from "react";
import { Input } from "./Input";

export interface Props
  extends Omit<HTMLProps<HTMLInputElement>, "prefix" | "size" | "ref"> {
  label?: string;
}

export const InputSecret = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { value, className, ...restProps } = props;
  const [isSecret, setSecret] = useState<boolean>(true);

  const onClickEye = (e: any) => {
    e.preventDefault();
    setSecret(!isSecret);
  };

  return (
    <Input
      ref={ref}
      className={className}
      type={isSecret ? "password" : "text"}
      suffix={
        <button
          type="button"
          className="focus:none cursor-pointer hover:text-white transition bg-transparent border-none focus:outline-none p-0 m-0"
          onClick={onClickEye}
        >
          {isSecret ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        </button>
      }
      {...restProps}
    />
  );
});
