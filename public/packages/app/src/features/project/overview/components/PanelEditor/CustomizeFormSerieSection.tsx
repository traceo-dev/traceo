import { DeepPartial, IMetricSerie, Setter } from "@traceo/types";
import { Row } from "@traceo/ui";
import { FC } from "react";
import { CustomizeFormSection } from "./CustomizeFormSection";

interface Props {
  collapsed?: boolean;
  serie: DeepPartial<IMetricSerie>;
  onDelete: Setter<IMetricSerie>;
}
export const CustomizeFormSerieSection: FC<Props> = ({
  children,
  serie,
  onDelete = undefined,
  collapsed = true
}) => {
  const backgroundColor = serie.config.color;
  return (
    <CustomizeFormSection
      title={
        <Row gap="x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor }} />
          <span>{serie.name}</span>
        </Row>
      }
      defaultCollapsed={collapsed}
      description={serie?.description}
      onDelete={() => onDelete && onDelete(serie as IMetricSerie)}
    >
      {children}
    </CustomizeFormSection>
  );
};
