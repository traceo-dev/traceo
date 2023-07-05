import { DeepPartial, IMetricSerie, Setter } from "@traceo/types";
import { Row } from "@traceo/ui";
import { FC } from "react";
import { CustomizeFormSection } from "./CustomizeFormSection";

interface Props {
  serie: DeepPartial<IMetricSerie>;
  onDelete: Setter<IMetricSerie>;
}
export const CustomizeFormSerieSection: FC<Props> = ({ children, serie, onDelete }) => {
  const backgroundColor = serie.config.color;
  return (
    <CustomizeFormSection
      title={
        <Row gap="x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor }} />
          <span>{serie.name}</span>
        </Row>
      }
      description={serie?.description}
      onDelete={() => onDelete(serie as IMetricSerie)}
    >
      {children}
    </CustomizeFormSection>
  );
};
