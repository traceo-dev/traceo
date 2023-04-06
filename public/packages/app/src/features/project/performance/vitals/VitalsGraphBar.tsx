import { LoadingOutlined } from "@ant-design/icons";
import { VitalsEnum, Performance } from "@traceo/types";
import { useMemo } from "react";
import { mapHealthToIcon } from "./types";
import {
  calculateHealthPercentage,
  calculatePercentile,
  vitalsFormatter,
  healthColor
} from "./utils";

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

  if (!performances || performances.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-row gap-x-5 justify-end">
      {p75 && <span className="whitespace-nowrap font-semibold">p75 ({p75})</span>}
      {healthPercentage ? (
        Object.entries(healthPercentage).map(([key, value], index) => (
          <div
            key={index}
            className="flex flex-row gap-x-2 items-center"
            style={{ color: healthColor[key] }}
          >
            {mapHealthToIcon[key]}
            <span className="whitespace-nowrap font-semibold">{value}%</span>
          </div>
        ))
      ) : (
        <LoadingOutlined />
      )}
    </div>
  );
};
