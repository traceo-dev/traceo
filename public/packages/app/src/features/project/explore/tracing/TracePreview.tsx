import { CloseOutlined, DownloadOutlined } from "@ant-design/icons";
import { Setter, Span } from "@traceo/types";
import { ContentCard } from "../../../../core/components/ContentCard";
import { useReactQuery } from "../../../../core/hooks/useReactQuery";
import { SpansTimelineList } from "./view/SpansTimelineList";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { downloadFile } from "../../../../core/utils/download";
import { Alert, Row, Tooltip } from "@traceo/ui";
import { prepareSpansToDownload } from "./utils";
import { GH_REPO_ISSUE_LINK } from "../../../../core/utils/constants";

interface Props {
  trace: Span;
  onClose: Setter<void>;
}

export const TracePreview = ({ onClose, trace }: Props) => {
  const { data: spans = [], isLoading = false } = useReactQuery<Span[]>({
    queryKey: [`trace_preview_${trace.id}`],
    url: `/api/tracing/parent/${trace.trace_id}`
  });

  const onExport = () => {
    const filename = `trace-${trace.trace_id}`;
    const content = prepareSpansToDownload(spans);
    downloadFile(content, "json", filename);
  };

  return (
    <div className="col-span-9 ml-2 relative">
      <ContentCard
        name={`${trace.service_name}/${trace.name}  (${trace.duration.toFixed(2)}ms)`}
        extra={
          <Row gap="x-3">
            <Tooltip title="Download trace as json">
              <DownloadOutlined className="icon-btn" onClick={() => onExport()} />
            </Tooltip>
            <Tooltip title="Close">
              <CloseOutlined className="icon-btn" onClick={() => onClose()} />
            </Tooltip>
          </Row>
        }
      >
        <ConditionalWrapper isLoading={isLoading}>
          <SpansTimelineList root={trace} spans={spans} />
          <Alert
            className="mt-12"
            closeable
            type="info"
            message={
              <span className="text-xs">
                The trace overview is still being developed and adapted to your needs. Leave your
                feedback on{" "}
                <a className="text-white underline" target="_blank" href={GH_REPO_ISSUE_LINK}>
                  Github
                </a>
                !
              </span>
            }
          />
        </ConditionalWrapper>
      </ContentCard>
    </div>
  );
};
