import styled from "styled-components";
import { Performance, VitalsEnum } from "@traceo/types";
import { useMemo } from "react";
import { calculateHealthPercentage, healthColor } from "./utils";
import { useParams } from "react-router-dom";

const VitalBar = styled.div`
  width: 100%;
  height: 15px;
  display: flex;
  flex-direction: row;
  margin-bottom: 4px;
`;

const BarPart = styled.div<{
  width;
  color;
}>`
  height: 100%;
  width: ${(p) => p.width}%;
  background-color: ${(p) => p.color};
`;

interface Props {
  list: Performance[];
}
export const VitalsHealthBar = ({ list }: Props) => {
  const { name } = useParams();

  if (!list || list.length === 0) {
    return null;
  }

  const health = useMemo(() => {
    const type = name as VitalsEnum;
    const barHealth = calculateHealthPercentage(type, list);
    return barHealth;
  }, [list]);

  return (
    <VitalBar>
      {Object.entries(health).map(([key, value]) => (
        <BarPart width={value} color={healthColor[key]} />
      ))}
    </VitalBar>
  );
};
