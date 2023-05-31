import { Page } from "../../../core/components/Page";
import { useTimeRange } from "../../../core/hooks/useTimeRange";
import { conditionClass } from "../../../core/utils/classes";
import { MetricCustomizeForm } from "./components/MetricCustomizeForm";
import { IMetric, DeepPartial, ApiResponse } from "@traceo/types";
import { Button, Card, Popover, Row } from "@traceo/ui";
import { useEffect, useState } from "react";
import { To, useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import MetricPreviewChart from "../../../core/components/Charts/Metrics/MetricPreviewChart";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { useReactQuery } from "src/core/hooks/useReactQuery";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  LeftOutlined,
  LoadingOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { isEmptyObject } from "../../../core/utils/object";
import { TraceoLoading } from "../../../core/components/TraceoLoading";
import { SearchWrapper } from "src/core/components/SearchWrapper";
import { MetricTimeToolbar } from "./components/MetricTimeToolbar";
import { ActionButton } from "../../../core/components/ActionButton";
import api from "src/core/lib/api";
import { Confirm } from "src/core/components/Confirm";
import styled from "styled-components";
import { PreviewPageHeader } from "src/core/components/PreviewPageHeader";

const GraphOption = styled.div`
  padding: 4px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  whitespace: nowrap;

  &:hover {
    background-color: var(--color-bg-secondary);
  }
`;

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

  useEffect(() => {
    refetch();
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
            <Button size="sm" onClick={() => setCustomizeMode(true)} icon={<SettingOutlined />}>
              Configure
            </Button>
            <Confirm
              description="Are you sure that you want to remove this metric?"
              onOk={() => onRemove()}
            >
              <Button size="sm" variant="danger">
                Remove
              </Button>
            </Confirm>
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
            <div className="felx flex-col w-full p-4 bg-primary border border-solid border-secondary rounded">
              <div className="flex flex-row justify-between pb-12">
                <span className="font-semibold text-sm">Graph</span>
                <MetricTimeToolbar ranges={ranges} setRanges={setRanges} />
              </div>
              <ConditionalWrapper isLoading={isLoading}>
                <MetricPreviewChart
                  datasource={data?.datasource}
                  isLoading={isLoading}
                  ranges={ranges}
                  setRanges={setRanges}
                  options={options}
                  activeZoomSelect={!isCustomizeMode}
                />
              </ConditionalWrapper>
            </div>
          </div>
          {isCustomizeMode && (
            <div className="col-span-4">
              <MetricCustomizeForm setOptions={setOptions} options={options} />
            </div>
          )}
        </div>
      </Page.Content>
    </Page>
  );
};

export default MetricPreviewPage;
