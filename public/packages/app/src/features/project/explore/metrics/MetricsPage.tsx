import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { ExploreViewProps } from "../ExplorePage";
import { OptionsCollapseGroup } from "../components/OptionsCollapseGroup";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import {
  BlockOutlined,
  CloseOutlined,
  DeleteOutlined,
  LoadingOutlined,
  NodeIndexOutlined
} from "@ant-design/icons";
import { Alert, Col, Input, RadioButtonGroup, Row, Select, SelectOptionProps } from "@traceo/ui";
import { metricsApi } from "./api";
import { useReactQuery } from "../../../../core/hooks/useReactQuery";
import { Field } from "../components/Field";
import { InlineFields } from "../components/InlineFields";
import { ActionButton } from "../../../../core/components/ActionButton";
import { GRAPH_TYPE_OPTIONS } from "../types";
import {
  ExploreSerieType,
  EXPLORE_PLOT_TYPE,
  AVAILABLE_COLORS,
  TimeRange,
  UplotDataType
} from "@traceo/types";
import { ButtonOptionsWrapper } from "../components";
import { UPlotMetricsGraph } from "./UPlotMetricsGraph";
import { PanelDatasourceTable } from "../../overview/components/PanelDatasourceTable";

export const MetricsPage = forwardRef(
  (
    {
      setLoading = undefined,
      setRanges = undefined,
      loading = false,
      ranges = [undefined, undefined]
    }: ExploreViewProps,
    ref
  ) => {
    const { id } = useParams();

    const inputMin = useRef<HTMLInputElement>(null);
    const inputMax = useRef<HTMLInputElement>(null);

    const [graph, setGraph] = useState<UplotDataType>([[]]);
    const [rawData, setRawData] = useState<[]>([]);
    const [loadingRaw, setLoadingRaw] = useState<boolean>(false);

    const [series, setSeries] = useState<ExploreSerieType[]>([]);
    const [maxSeriesError, setMaxSeriesError] = useState<boolean>(false);

    const [graphType, setGraphType] = useState<EXPLORE_PLOT_TYPE>("line");
    const [stackedGraph, setStackedGraph] = useState<boolean>(false);
    const [markers, setMarkers] = useState<boolean>(false);

    const [valueMin, setValueMin] = useState<number>(null);
    const [valueMax, setValueMax] = useState<number>(null);
    // const [interval, setInterval] = useState<number>(1);

    useImperativeHandle(ref, () => ({
      fetch
    }));

    const baseQueryProps = {
      fields: series.map((e) => e.name) ?? [],
      // interval,
      valueMax,
      valueMin
    };

    const fetch = async () => {
      const props = {
        from: ranges[0],
        to: ranges[1],
        ...baseQueryProps
      };

      await loadData(props);
    };

    const { data: fieldsOptions = [], isFetching: fetchingFields } = useReactQuery<
      SelectOptionProps[]
    >({
      queryKey: [`metrics_fields_${id}`],
      url: `/api/metrics/fields/${id}`
    });

    const options = () =>
      fieldsOptions?.map((opt) => ({
        ...opt,
        disabled: !!series.find((e) => e.name === opt.value)
      }));

    const loadData = async (props: any) => {
      setLoading(true);
      setLoadingRaw(true);

      await metricsApi
        .loadGraph(id, props)
        .then((resp) => {
          if (resp.status === "success") {
            setGraph(resp.data.datasource);
          }
        })
        .finally(() => {
          setLoading(false);
        });

      await metricsApi
        .loadRawData(id, props)
        .then((resp) => {
          if (resp.status === "success") {
            setRawData(resp.data);
          }
        })
        .finally(() => {
          setLoadingRaw(false);
        });
    };

    const onZoom = async (ranges: TimeRange) => {
      setRanges(ranges);

      await loadData({
        from: ranges[0],
        to: ranges[1],
        ...baseQueryProps
      });
    };

    const getQueriesLabel = () => {
      const queries: string[] = [];
      const s = series.map((e) => e.name);
      series.length > 0 && queries.push(`Series: ${s.join("; ")}`);
      valueMax && queries.push(`Value max: ${valueMax}`);
      valueMin && queries.push(`Value min: ${valueMin}`);
      return queries.join(", ");
    };

    const clearQuery = () => {
      inputMax.current.value = null;
      inputMin.current.value = null;

      setValueMax(null);
      setValueMin(null);

      setSeries([]);
    };

    const onAddSerie = (serie: string) => {
      // We have to clear graph payload on each serie mutation
      setGraph([[]]);
      setRawData([]);
      setMaxSeriesError(false);

      if (series.length < 8) {
        setSeries([
          ...series,
          {
            color: AVAILABLE_COLORS[series.length + 1],
            name: serie
          }
        ]);
      } else {
        setMaxSeriesError(true);
      }
    };

    const onRemoveSerie = (serie: ExploreSerieType) => {
      setGraph([[]]);
      setRawData([]);
      const s = series.filter((s) => s !== serie);
      setSeries(s);

      if (s.length < 8) {
        setMaxSeriesError(false);
      }
    };

    const getTableFields = () => series.map(({ name }) => name);

    return (
      <Col>
        <OptionsCollapseGroup
          scrollableBody={false}
          deafultCollapsed={true}
          title="Options"
          collapsedText={getQueriesLabel()}
          extra={<DeleteOutlined className="icon-btn" onClick={() => clearQuery()} />}
        >
          <InlineFields>
            <Field
              title="Series"
              tooltip={maxSeriesError ? "You can select at most 8 series." : undefined}
              className="col-span-3"
            >
              <Select
                options={options()}
                isDisabled={maxSeriesError}
                isLoading={fetchingFields}
                value={""}
                onChange={(opt) => onAddSerie(opt?.value)}
              />
            </Field>
            <Field title=" " className="col-span-3">
              <Row gap="x-3" className="pt-6">
                {series.map((serie, index) => (
                  <Row key={index} className="py-1 px-3 bg-secondary rounded-sm" gap="x-2">
                    <span>{serie.name}</span>
                    <CloseOutlined
                      onClick={() => onRemoveSerie(serie)}
                      className="text-[10px] hover:text-red-500 cursor-pointer"
                    />
                  </Row>
                ))}
              </Row>
            </Field>
          </InlineFields>
          <InlineFields>
            <Field tooltip="Min value for graph." title="Value min." className="col-span-3">
              <Input
                ref={inputMin}
                type="number"
                value={valueMin}
                onChange={(e) => setValueMin(e.target["value"])}
              />
            </Field>
            <Field tooltip="Max value for graph." title="Value max." className="col-span-3">
              <Input
                ref={inputMax}
                type="number"
                value={valueMax}
                onChange={(e) => setValueMax(e.target["value"])}
              />
            </Field>
          </InlineFields>
          {/* <InlineFields>
            <Field
              tooltip="The interval on the X-axis specifying the time between the next data. Value provided in minutes."
              title="Interval"
              className="col-span-3"
            >
              <Input
                min={1}
                type="number"
                value={interval}
                onChange={(e) => setInterval(e.target["value"])}
              />
            </Field>
          </InlineFields> */}
        </OptionsCollapseGroup>
        <OptionsCollapseGroup
          title="Graph"
          scrollableBody={false}
          deafultCollapsed={false}
          loading={loading}
        >
          <ButtonOptionsWrapper>
            <RadioButtonGroup
              size="sm"
              options={GRAPH_TYPE_OPTIONS}
              onChange={(e) => setGraphType(e)}
              value={graphType}
            />
            <ActionButton
              icon={<BlockOutlined />}
              tooltip="Stacked graph (experimental)"
              isActive={stackedGraph}
              onClick={() => setStackedGraph(!stackedGraph)}
            />
            <ActionButton
              icon={<NodeIndexOutlined />}
              tooltip="Graph markers"
              isActive={markers}
              onClick={() => setMarkers(!markers)}
            />
          </ButtonOptionsWrapper>
          <ConditionalWrapper
            isEmpty={(graph && graph[0]?.length === 0) || series.length === 0}
            emptyView={<DataNotFound label="No results for graph" />}
          >
            <UPlotMetricsGraph
              series={series}
              datasource={graph}
              onZoom={onZoom}
              type={graphType}
              stacked={stackedGraph}
              markers={markers}
            />
          </ConditionalWrapper>
        </OptionsCollapseGroup>
        <OptionsCollapseGroup
          title="Raw data"
          loading={loadingRaw}
          extra={
            <span className="text-xs font-semibold text-primary">
              {(rawData || []).length} rows found
            </span>
          }
        >
          <PanelDatasourceTable
            metricData={rawData}
            isLoading={loadingRaw}
            fields={getTableFields()}
          />
        </OptionsCollapseGroup>
      </Col>
    );
  }
);
