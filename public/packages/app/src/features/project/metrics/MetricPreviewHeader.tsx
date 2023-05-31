import { IMetric, DeepPartial } from "@traceo/types";
import { PageHeader } from "@traceo/ui";
import { FC } from "react";
import { PreviewPageHeader } from "src/core/components/PreviewPageHeader";

interface Props {
  currentOptions: DeepPartial<IMetric>;
  extra?: JSX.Element;
}
export const MetricPreviewHeader: FC<Props> = ({ currentOptions, extra }) => {
  return (
    <PageHeader
      className="border-bottom p-9 px-9"
      title={
        <PreviewPageHeader
          page="metrics"
          title={currentOptions?.name}
          description={currentOptions?.description}
        />
      }
      suffix={extra}
    />
  );
};
