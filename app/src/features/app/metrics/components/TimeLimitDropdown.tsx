import { ClockCircleOutlined } from "@ant-design/icons";
import { setLocalStorageTimeLimit } from "../../../../core/utils/localStorage";
import { FC } from "react";
import { timeLimitOptions, mapTimeLimitLabel } from "../../../../types/metrics";
import { Select } from "@traceo/ui";

interface Props {
  setTimeLimit: (val: number) => void;
  timeLimit: number;
}
export const TimeLimitDropdown: FC<Props> = ({ setTimeLimit, timeLimit = 12 }) => {
  const onChangeTimeLimit = (val: number) => {
    setTimeLimit(val);
    setLocalStorageTimeLimit(val);
  };

  const limitOptions = timeLimitOptions.map((limit) => ({
    value: limit,
    label: mapTimeLimitLabel[limit]
  }));

  return (
    <Select
      options={limitOptions}
      value={timeLimit}
      prefix={<ClockCircleOutlined />}
      width={150}
      onChange={(opt) => onChangeTimeLimit(opt?.value)}
    />
  );
};
