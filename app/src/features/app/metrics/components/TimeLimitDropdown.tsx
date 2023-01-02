import { ClockCircleOutlined } from "@ant-design/icons";
import { Menu, Dropdown, Button } from "antd";
import { conditionClass } from "core/utils/classes";
import { setLocalStorageTimeLimit } from "core/utils/localStorage";
import { FC } from "react";
import { timeLimitOptions, handleTimeLimitLabel } from "types/metrics";

interface Props {
  setTimeLimit: (val: number) => void;
  timeLimit: number;
  ghost?: boolean;
}
export const TimeLimitDropdown: FC<Props> = ({ setTimeLimit, timeLimit = 12, ghost }) => {
  const onSet = (val: number) => {
    setTimeLimit(val);
    setLocalStorageTimeLimit(val);
  };

  const overlay = (
    <Menu className="w-52" onClick={(val) => onSet(val.key as any)}>
      {timeLimitOptions.map((limit) => (
        <Menu.Item key={limit}>{handleTimeLimitLabel[limit]}</Menu.Item>
      ))}
    </Menu>
  );
  return (
    <Dropdown overlay={overlay} placement="bottom">
      <Button
        type="primary"
        className={conditionClass(
          ghost,
          "bg-secondary border-none",
          "hover:bg-black hover:text-white focus:bg-black"
        )}
      >
        <ClockCircleOutlined />
        <span>{handleTimeLimitLabel[timeLimit]}</span>
      </Button>
    </Dropdown>
  );
};
