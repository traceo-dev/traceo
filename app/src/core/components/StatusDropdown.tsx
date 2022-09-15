import { Dropdown, Button } from "antd";
import { FC } from "react";

interface Props {
  overlay: JSX.Element;
  value: string;
  label?: string;
}
export const SortDropdown: FC<Props> = ({ overlay, value, label = "Status:" }) => {
  return (
    <Dropdown overlay={overlay} placement="bottom">
      <Button>
        {label}&nbsp;
        <span className="font-bold">{value}</span>
      </Button>
    </Dropdown>
  );
};
