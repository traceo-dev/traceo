import { mapLogName } from "../../../../core/components/Plots/components/Logs/util";
import { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import { LogLevel } from "@traceo/types";
import { StoreState } from "@store/types";
import { mapLogIcon } from "./LogContainer";
import { Typography, Card, Space, Row, Col, Checkbox } from "@traceo/ui";

interface Props {
  checkedLevels: LogLevel[];
  setCheckedLevels: (level: LogLevel[]) => void;
}
export const LogsFilterPanel: FC<Props> = ({ checkedLevels, setCheckedLevels }) => {
  const { logs } = useSelector((state: StoreState) => state.logs);

  // const calculateCountByLevel = (level: LogLevel) => {
  //   const logsByLevel = logs.filter((log) => log.level === level);
  //   return logsByLevel?.length || 0;
  // };

  const counts = useMemo(() => {
    return logs.reduce((acc, log) => {
      acc[log.level] = logs.filter(({ level }) => level === log.level);
      return acc;
    }, {});
  }, [logs]);

  return (
    <Card title="Filters">
      <div className="flex flex-col gap-3">
        <Col className="mt-2">
          {Object.values(LogLevel).map((level, index) => (
            <Row className="mb-2 justify-between items-center" key={index}>
              <Space>
                <Typography className="mr-1">{mapLogIcon[level]}</Typography>
                <Typography>
                  {mapLogName[level]} ({counts[level] || 0})
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
