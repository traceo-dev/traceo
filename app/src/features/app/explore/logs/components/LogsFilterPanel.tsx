import { Checkbox } from "antd";
import { handleLogName } from "../../../../../core/components/Plots/components/Logs/util";
import { FC } from "react";
import { useSelector } from "react-redux";
import { LogLevel } from "../../../../../types/logs";
import { StoreState } from "../../../../../types/store";
import { handleLogIcon } from "./LogContainer";
import { Typography } from "core/ui-components/Typography";
import { Card } from "core/ui-components/Card";
import { Space } from "core/ui-components/Space";
import { Row } from "core/ui-components/Row";
import { Col } from "core/ui-components/Col";

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
    <Card title="Filters">
      <Checkbox.Group
        className="w-full"
        defaultValue={checkedLevels}
        onChange={(val) => setCheckedLevels(val as LogLevel[])}
      >
        <Col className="mt-2">
          {Object.values(LogLevel).map((level, index) => (
            <Row className="w-full mb-2 justify-between" key={index}>
              <Space>
                <Typography className="mr-1">{handleLogIcon[level]}</Typography>
                <Typography>
                  {handleLogName[level]} ({calculateCountByLevel(level)})
                </Typography>
              </Space>
              <Checkbox value={level} />
            </Row>
          ))}
        </Col>
      </Checkbox.Group>
    </Card>
  );
};
