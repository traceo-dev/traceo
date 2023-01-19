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
import { Checkbox } from "core/ui-components/Checkbox";

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
      <div className="flex flex-col gap-3">
        <Col className="mt-2">
          {Object.values(LogLevel).map((level, index) => (
            <Row className="mb-2 justify-between items-center" key={index}>
              <Space>
                <Typography className="mr-1">{handleLogIcon[level]}</Typography>
                <Typography>
                  {handleLogName[level]} ({calculateCountByLevel(level)})
                </Typography>
              </Space>
              <Checkbox
                value={checkedLevels.includes(level)}
                onChange={(a) =>
                  a.currentTarget.checked
                    ? setCheckedLevels([level, ...checkedLevels])
                    : setCheckedLevels([...checkedLevels.filter((l) => l !== level)])
                }
              />
            </Row>
          ))}
        </Col>
      </div>
    </Card>
  );
};
