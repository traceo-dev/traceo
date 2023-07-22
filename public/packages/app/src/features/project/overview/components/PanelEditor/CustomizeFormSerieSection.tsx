import { DeepPartial, IMetricSerie } from "@traceo/types";
import { Row, conditionClass } from "@traceo/ui";
import { FC } from "react";
import { CustomizeFormSection } from "./CustomizeFormSection";

interface Props {
  collapsed?: boolean;
  serie: DeepPartial<IMetricSerie>;
  extra?: JSX.Element;
}
export const CustomizeFormSerieSection: FC<Props> = ({
  children,
  serie,
  collapsed = true,
  extra = undefined
}) => {
  const backgroundColor = serie.config.color;
  return (
    <CustomizeFormSection
      title={
        <Row gap="x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor }} />
          <span className={conditionClass(!serie?.field, "italic text-secondary font-normal")}>
            {serie?.field ?? "No field selected"}
          </span>
        </Row>
      }
      defaultCollapsed={collapsed}
      description={serie?.description}
      extra={extra}
    >
      {children}
    </CustomizeFormSection>
  );
};
