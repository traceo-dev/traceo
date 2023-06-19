import { Page } from "../../../core/components/Page";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import { conditionClass } from "../../../core/utils/classes";
import { MetricCustomizeForm } from "./components/MetricCustomizeForm";
import { IMetric, DeepPartial, ApiResponse, MemberRole } from "@traceo/types";
import { Button, Row } from "@traceo/ui";
import { useEffect, useState } from "react";
import { To, useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import { Permissions } from "../../../core/components/Permissions";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { useReactQuery } from "../../../core/hooks/useReactQuery";
import { CheckOutlined, SettingOutlined } from "@ant-design/icons";
import { isEmptyObject } from "../../../core/utils/object";
import { TraceoLoading } from "../../../core/components/TraceoLoading";
import { MetricTimeToolbar } from "./components/MetricTimeToolbar";
import api from "../../../core/lib/api";
import { Confirm } from "../../../core/components/Confirm";
import { PreviewPageHeader } from "../../../core/components/PreviewPageHeader";
import { ContentCard } from "../../../core/components/ContentCard";
import { MetricTableWrapper } from "./components/MetricTableWrapper";
import { OptionsCollapseGroup } from "../explore/components/OptionsCollapseGroup";
import { UPlotMetricPreviewGraph } from "./components/UPlotMetricPreviewGraph";
import { notify } from "src/core/utils/notify";

export const MetricPreviewPage = () => {
  const navigate = useNavigate();
  const { metricId, id } = useParams();
  const { ranges, setRanges } = useTimeRange();
  const [options, setOptions] = useImmer<DeepPartial<IMetric>>(undefined);
  const [isCustomizeMode, setCustomizeMode] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [removeLoading, setRemoveLoading] = useState<boolean>(false);

  const { data, refetch, isLoading, isRefetching } = useReactQuery<any>({
    queryKey: [`metric_ds_${metricId}`],
    url: `/api/metrics/${id}/preview/${metricId}`,
    params: {
      from: ranges[0],
      to: ranges[1]
    }
  });

  const {
    data: rawData = [],
    refetch: refetchRawData,
    isLoading: isLoadingRawData,
    isRefetching: isRefetchinRawData
  } = useReactQuery<any>({
    queryKey: [`metric_ds_raw_${metricId}`],
    url: `/api/metrics/${id}/raw-data`,
    params: {
      from: ranges[0],
      to: ranges[1],
      metricId
    }
  });

  useEffect(() => {
    refetch();
    refetchRawData();
  }, [ranges, metricId]);

  useEffect(() => {
    if (data && data.options) {
      setOptions(data.options);
    }
  }, [data]);

  if (!options || isEmptyObject(options)) {
    return <TraceoLoading />;
  }

  const onSave = async () => {
    if (!options.name) {
      notify.error("Metric name is required.");
      return;
    }

    const series = options.series;
    if (series.length === 0) {
      notify.error("You have to add at least one serie to this metric.");
      return;
    }

    const missingName = series.find((serie) => !serie?.name);
    if (missingName) {
      notify.error("Your metric serie does not have a required name value.");
      return;
    }

    const missingField = series.find((serie) => !serie?.field);
    if (missingField) {
      notify.error("Your metric serie does not have a required field value.");
      return;
    }

    setSaveLoading(true);

    await api
      .patch<ApiResponse<string>>(`/api/metrics/${metricId}/update`, options)
      .then(() => {
        refetch();
      })
      .finally(() => {
        setSaveLoading(false);
        setCustomizeMode && setCustomizeMode(false);
      });
  };

  const onDiscard = () => {
    setOptions(data.options);
    setCustomizeMode(false);
  };

  const onRemove = async () => {
    setRemoveLoading(true);
    await api
      .delete<ApiResponse<string>>(`/api/metrics/${metricId}`)
      .then(() => {
        navigate(`/project/${id}/metrics`);
      })
      .finally(() => {
        setRemoveLoading(false);
      });
  };

  const backOpts: To = {
    pathname: `/project/${id}/metrics`,
    search: `?from=${ranges[0]}&to=${ranges[1]}`
  };

  const getTableFields = () =>
    options?.series.filter(({ show }) => show).map(({ field }) => field);

  return (
    <Page
      isLoading={isLoading}
      header={{
        title: (
          <PreviewPageHeader
            page="metrics"
            title={options.name}
            description={options.description}
            backOpts={backOpts}
          />
        ),
        suffix: !isCustomizeMode ? (
          <Row gap="x-3">
            <Permissions statuses={[MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER]}>
              <Button size="sm" onClick={() => setCustomizeMode(true)} icon={<SettingOutlined />}>
                Configure
              </Button>
            </Permissions>
            {!options.isDefault && (
              <Permissions statuses={[MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER]}>
                <Confirm
                  description="Are you sure that you want to remove this metric?"
                  onOk={() => onRemove()}
                >
                  <Button size="sm" variant="danger">
                    Remove
                  </Button>
                </Confirm>
              </Permissions>
            )}
          </Row>
        ) : (
          <Row gap="x-3">
            <Button
              icon={<CheckOutlined />}
              loading={saveLoading}
              variant="primary"
              size="sm"
              onClick={() => onSave()}
            >
              Update
            </Button>
            <Button
              loading={removeLoading}
              variant="danger"
              size="sm"
              onClick={() => onDiscard()}
            >
              Cancel
            </Button>
          </Row>
        )
      }}
    >
      <Page.Content className="pt-0">
        <div className="w-full grid grid-cols-12">
          <div className={conditionClass(isCustomizeMode, "col-span-8 mr-1", "col-span-12")}>
            <ContentCard
              name="Graph"
              loading={isLoading || isRefetching}
              extra={<MetricTimeToolbar ranges={ranges} setRanges={setRanges} />}
            >
              <ConditionalWrapper isLoading={isLoading}>
                <UPlotMetricPreviewGraph
                  datasource={data?.datasource}
                  metric={options as IMetric}
                  onZoom={setRanges}
                />
              </ConditionalWrapper>
            </ContentCard>
            <OptionsCollapseGroup
              title="Raw data"
              loading={isLoadingRawData || isRefetchinRawData}
              extra={
                <span className="text-xs font-semibold text-primary">
                  {(rawData || []).length} rows found
                </span>
              }
            >
              <MetricTableWrapper
                fields={getTableFields()}
                metricData={rawData}
                isLoading={isLoadingRawData || isRefetchinRawData}
              />
            </OptionsCollapseGroup>
          </div>
          {isCustomizeMode && (
            <div className="col-span-4">
              <MetricCustomizeForm
                data={data?.datasource}
                setOptions={setOptions}
                options={options}
              />
            </div>
          )}
        </div>
      </Page.Content>
    </Page>
  );
};

export default MetricPreviewPage;
