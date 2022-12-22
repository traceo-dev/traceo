import { Typography, Checkbox, Col, Row, Space } from "antd";
import { PagePanel } from "../../../../../core/components/PagePanel";
import { handleLogName } from "../../../../../core/components/Plots/components/Logs/util";
import { FC } from "react";
import { useSelector } from "react-redux";
import { LogLevel } from "../../../../../types/logs";
import { StoreState } from "../../../../../types/store";
import { handleLogIcon } from "./LogContainer";

interface Props {
  checkedLevels: LogLevel[];
  setCheckedLevels: (level: LogLevel[]) => void;
}
export const LogsFilterPanel: FC<Props> = ({ checkedLevels, setCheckedLevels }) => {
  const { logs } = useSelector((state: StoreState) => state.logs);

  const calculateCountByLevel = (level: LogLevel) => {
    const logsByLevel = logs.filter((log) => log.level === level);
    return logsByLevel?.length || 0;
  };

  return (
    <PagePanel title="Filters">
      <Checkbox.Group
        className="w-full"
        defaultValue={checkedLevels}
        onChange={(val) => setCheckedLevels(val as LogLevel[])}
      >
        <Col className="mt-2">
          {Object.values(LogLevel).map((level, index) => (
            <Row className="w-full mb-2 justify-between" key={index}>
              <Space>
                <Typography.Text className="mr-1">{handleLogIcon[level]}</Typography.Text>
                <Typography.Text>
                  {handleLogName[level]} ({calculateCountByLevel(level)})
                </Typography.Text>
              </Space>
              <Checkbox value={level} />
            </Row>
          ))}
        </Col>
      </Checkbox.Group>
    </PagePanel>
  );
};
