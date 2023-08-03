import { LoadingOutlined } from "@ant-design/icons";
import { VitalsEnum, Performance, isEmpty } from "@traceo/types";
import { useMemo } from "react";
import { mapHealthToIcon } from "./types";
import {
  calculateHealthPercentage,
  calculatePercentile,
  vitalsFormatter,
  healthColor
} from "./utils";
import { Row } from "@traceo/ui";

interface Props {
  name: string;
  performances: Performance[];
}
export const VitalsGraphBar = ({ name, performances }: Props) => {
  const healthPercentage = useMemo(() => {
    const type = name as VitalsEnum;
    const barHealth = calculateHealthPercentage(type, performances);
    return barHealth;
  }, [performances]);

  const p75 = useMemo(() => {
    const percentil = calculatePercentile<Performance>(performances);
    return vitalsFormatter(name, percentil);
  }, [performances]);

  if (isEmpty(performances)) {
    return null;
  }

  return (
    <Row gap="x-3" className="justify-end text-sm">
      {p75 && <span className="whitespace-nowrap font-semibold">p75 ({p75})</span>}
      {healthPercentage ? (
        Object.entries(healthPercentage).map(([key, value], index) => (
          <Row key={index} gap="x-2" className="items-center" style={{ color: healthColor[key] }}>
            {mapHealthToIcon[key]}
            <span className="whitespace-nowrap font-semibold">{value}%</span>
          </Row>
        ))
      ) : (
        <LoadingOutlined />
      )}
    </Row>
  );
};
