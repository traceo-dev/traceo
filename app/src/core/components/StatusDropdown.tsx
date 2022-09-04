import { Dropdown, Button } from "antd";
import { FC } from "react";

interface Props {
  overlay: JSX.Element;
  value: string;
}
export const StatusDropdown: FC<Props> = ({ overlay, value }) => {
  return (
    <Dropdown overlay={overlay} placement="bottom">
      <Button>
        Status:&nbsp;
        <span className="font-bold">{value}</span>
      </Button>
    </Dropdown>
  );
};
