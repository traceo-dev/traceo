import * as http from "http";
import * as https from "https";

/**
 * Types from Open Telemetry repository: https://github.com/open-telemetry/opentelemetry-js
 */

/**
 * Attributes is a map from string to attribute values.
 *
 * Note: only the own enumerable keys are counted as valid attribute keys.
 */
export interface Attributes {
    [attributeKey: string]: AttributeValue | undefined;
}
/**
 * Attribute values may be any non-nullish primitive value except an object.
 *
 * null or undefined attribute values are invalid and will result in undefined behavior.
 */
export type AttributeValue = string | number | boolean | Array<null | undefined | string> | Array<null | undefined | number> | Array<null | undefined | boolean>;

/**
 * Defines High-Resolution Time.
 *
 * The first number, HrTime[0], is UNIX Epoch time in seconds since 00:00:00 UTC on 1 January 1970.
 * The second number, HrTime[1], represents the partial second elapsed since Unix Epoch time represented by first number in nanoseconds.
 * For example, 2021-01-01T12:30:10.150Z in UNIX Epoch time in milliseconds is represented as 1609504210150.
 * The first number is calculated by converting and truncating the Epoch time in milliseconds to seconds:
 * HrTime[0] = Math.trunc(1609504210150 / 1000) = 1609504210.
 * The second number is calculated by converting the digits after the decimal point of the subtraction, (1609504210150 / 1000) - HrTime[0], to nanoseconds:
 * HrTime[1] = Number((1609504210.150 - HrTime[0]).toFixed(9)) * 1e9 = 150000000.
 * This is represented in HrTime format as [1609504210, 150000000].
 */
export type HrTime = [number, number];

/**
 * An instrumentation scope consists of the name and optional version
 * used to obtain a tracer or meter from a provider. This metadata is made
 * available on ReadableSpan and MetricRecord for use by the export pipeline.
 */
export interface InstrumentationScope {
    readonly name: string;
    readonly version?: string;
    readonly schemaUrl?: string;
}

/** DataPoint value type for HistogramAggregation. */
export interface Histogram {
    /**
     * Buckets are implemented using two different arrays:
     *  - boundaries: contains every finite bucket boundary, which are inclusive lower bounds
     *  - counts: contains event counts for each bucket
     *
     * Note that we'll always have n+1 buckets, where n is the number of boundaries.
     * This is because we need to count events that are below the lowest boundary.
     *
     * Example: if we measure the values: [5, 30, 5, 40, 5, 15, 15, 15, 25]
     *  with the boundaries [ 10, 20, 30 ], we will have the following state:
     *
     * buckets: {
     *	boundaries: [10, 20, 30],
     *	counts: [3, 3, 1, 2],
     * }
     */
    buckets: {
        boundaries: number[];
        counts: number[];
    };
    sum?: number;
    count: number;
    min?: number;
    max?: number;
}
/** DataPoint value type for ExponentialHistogramAggregation. */
export interface ExponentialHistogram {
    count: number;
    sum?: number;
    scale: number;
    zeroCount: number;
    positive: {
        offset: number;
        bucketCounts: number[];
    };
    negative: {
        offset: number;
        bucketCounts: number[];
    };
    min?: number;
    max?: number;
}

export enum AggregationTemporality {
    DELTA = 0,
    CUMULATIVE = 1
}

/**
 * Basic metric data fields.
 */
interface BaseMetricData {
    readonly descriptor: InstrumentDescriptor;
    readonly aggregationTemporality: AggregationTemporality;
    /**
     * DataPointType of the metric instrument.
     */
    readonly dataPointType: DataPointType;
}
/**
 * Represents a metric data aggregated by either a LastValueAggregation or
 * SumAggregation.
 */
export interface SumMetricData extends BaseMetricData {
    readonly dataPointType: DataPointType.SUM;
    readonly dataPoints: DataPoint<number>[];
    readonly isMonotonic: boolean;
}
export interface TimeSeriesMetricData extends BaseMetricData {
    readonly dataPointType: DataPointType.TIME_SERIES;
    readonly dataPoints: DataPoint<number>[];
}
export interface GaugeMetricData extends BaseMetricData {
    readonly dataPointType: DataPointType.GAUGE;
    readonly dataPoints: DataPoint<number>[];
}
/**
 * Represents a metric data aggregated by a HistogramAggregation.
 */
export interface HistogramMetricData extends BaseMetricData {
    readonly dataPointType: DataPointType.HISTOGRAM;
    readonly dataPoints: DataPoint<Histogram>[];
}
/**
 * Represents a metric data aggregated by a ExponentialHistogramAggregation.
 */
export interface ExponentialHistogramMetricData extends BaseMetricData {
    readonly dataPointType: DataPointType.EXPONENTIAL_HISTOGRAM;
    readonly dataPoints: DataPoint<ExponentialHistogram>[];
}
/**
 * Represents an aggregated metric data.
 */
export type MetricData = SumMetricData | GaugeMetricData | TimeSeriesMetricData | HistogramMetricData | ExponentialHistogramMetricData;
export interface ScopeMetrics {
    scope: InstrumentationScope;
    metrics: MetricData[];
}

/**
 * The aggregated point data type.
 */
export enum DataPointType {
    /**
     * A histogram data point contains a histogram statistics of collected
     * values with a list of explicit bucket boundaries and statistics such
     * as min, max, count, and sum of all collected values.
     */
    HISTOGRAM = 0,
    /**
     * An exponential histogram data point contains a histogram statistics of
     * collected values where bucket boundaries are automatically calculated
     * using an exponential function, and statistics such as min, max, count,
     * and sum of all collected values.
     */
    EXPONENTIAL_HISTOGRAM = 1,
    /**
     * A gauge metric data point has only a single numeric value.
     */
    GAUGE = 2,
    /**
     * A sum metric data point has a single numeric value and a
     * monotonicity-indicator.
     */
    SUM = 3,
    /**
     * A value correlated to time when occur
     */
    TIME_SERIES = 4
}
/**
 * Represents an aggregated point data with start time, end time and their
 * associated attributes and points.
 */
export interface DataPoint<T> {
    /**
     * The start epoch timestamp of the DataPoint, usually the time when
     * the metric was created when the preferred AggregationTemporality is
     * CUMULATIVE, or last collection time otherwise.
     */
    readonly startTime: HrTime;
    /**
     * The end epoch timestamp when data were collected, usually it represents
     * the moment when `MetricReader.collect` was called.
     */
    readonly endTime: HrTime;
    /**
     * The attributes associated with this DataPoint.
     */
    readonly attributes: Attributes;
    /**
     * The value for this DataPoint. The type of the value is indicated by the
     * {@link DataPointType}.
     */
    readonly value: T;
}

/**
 * Supported types of metric instruments.
 */
export enum InstrumentType {
    COUNTER = "COUNTER",
    HISTOGRAM = "HISTOGRAM",
    UP_DOWN_COUNTER = "UP_DOWN_COUNTER",
    OBSERVABLE_COUNTER = "OBSERVABLE_COUNTER",
    OBSERVABLE_GAUGE = "OBSERVABLE_GAUGE",
    OBSERVABLE_UP_DOWN_COUNTER = "OBSERVABLE_UP_DOWN_COUNTER",

    // NEW
    TIME_SERIES = "TIME_SERIES"
}

/** The Type of value. It describes how the data is reported. */
export enum ValueType {
    INT = 0,
    DOUBLE = 1
}

/**
 * An interface describing the instrument.
 */
export interface InstrumentDescriptor {
    readonly name: string;
    readonly description: string;
    readonly unit: string;
    readonly type: InstrumentType;
    readonly valueType: ValueType;
}

export interface OTLPExporterConfigBase {
    headers?: Partial<Record<string, unknown>>;
    hostname?: string;
    url?: string;
    concurrencyLimit?: number;
    /** Maximum time the OTLP exporter will wait for each batch export.
     * The default value is 10000ms. */
    timeoutMillis?: number;
}

export interface OTLPMetricExporterOptions extends OTLPExporterConfigBase {
    temporalityPreference?: AggregationTemporality;
}

export interface OTLPExporterNodeConfigBase extends OTLPExporterConfigBase {
    keepAlive?: boolean;
    compression?: CompressionAlgorithm;
    httpAgentOptions?: http.AgentOptions | https.AgentOptions;
}

export enum CompressionAlgorithm {
    NONE = "none",
    GZIP = "gzip"
}

export interface ScopeMetrics {
    scope: InstrumentationScope;
    metrics: MetricData[];
}

/**
 * An interface that represents a resource. A Resource describes the entity for which signals (metrics or trace) are
 * collected.
 *
 */
export interface IResource {
    /**
     * Check if async attributes have resolved. This is useful to avoid awaiting
     * waitForAsyncAttributes (which will introduce asynchronous behavior) when not necessary.
     *
     * @returns true if the resource "attributes" property is not yet settled to its final value
     */
    asyncAttributesPending?: boolean;
    /**
     * @returns the Resource's attributes.
     */
    readonly attributes: Attributes;
    /**
     * Returns a promise that will never be rejected. Resolves when all async attributes have finished being added to
     * this Resource's attributes. This is useful in exporters to block until resource detection
     * has finished.
     */
    waitForAsyncAttributes?(): Promise<void>;
    /**
     * Returns a new, merged {@link Resource} by merging the current Resource
     * with the other Resource. In case of a collision, other Resource takes
     * precedence.
     *
     * @param other the Resource that will be merged with this.
     * @returns the newly merged Resource.
     */
    merge(other: IResource | null): IResource;
}

export interface ResourceMetrics {
    resource: IResource;
    scopeMetrics: ScopeMetrics[];
}

export enum ExportResultCode {
    SUCCESS = 0,
    FAILED = 1
}

export interface ExportResult {
    code: ExportResultCode;
    error?: Error;
}
