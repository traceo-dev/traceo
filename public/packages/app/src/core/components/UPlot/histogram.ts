import { UplotDataType } from "@traceo/types";

/**
 * Function to parse datasource for histogram with support for each serie.
 *
 * We show only bins on x-axis from the first value on x-axis correlated to y-axis
 * to avoid misleading graph preview.
 */
type HistogramConfigs = {
  bucketSize: number;
  min: number;
  max: number;
};
export const prepareBinsData = (
  datasource: UplotDataType,
  config: HistogramConfigs
): UplotDataType => {
  const { bucketSize = 5, min: cMin = 0 } = config;

  const series = datasource.slice(1);
  const seriesData: number[][] = [];

  const bins = calculateHistogramBins(datasource, bucketSize);

  for (const serie of series) {
    const serieDatasource: number[] = [];

    // For each bins (x) create new datasource (y)
    for (let i = 0; i <= bins.length - 1; i++) {
      const min = bins[i];
      const max = bins[i + 1];
      const vals = serie.filter((value) => {
        return value >= cMin && value >= min && value <= max;
      });
      serieDatasource.push(vals.length);
    }

    seriesData.push(serieDatasource);
  }

  return [bins, ...seriesData];
};

export const calculateHistogramBins = (datasource: UplotDataType, bucketSize: number) => {
  const series = datasource.slice(1);

  // single array of values for each serie
  const xSeries = [].concat(...series);

  // Used reduce to avoid Uncaught RangeError: Maximum call stack size exceeded
  // min value on x-axis
  const min = xSeries.reduce((a, b) => Math.min(a, b), 0);

  // max value on x-axis
  const max = xSeries.reduce((a, b) => Math.max(a, b), 0);

  return Array.from(
    { length: Math.floor((max - min) / bucketSize) + 2 },
    (_, index) => min + index * bucketSize
  );
};
