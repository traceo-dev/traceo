export const normalizePlotData = (plotData: Array<{ date: number; count: number }>) => {
    return {
        x: plotData?.map((plot) => plot.date) || [],
        y: plotData?.map((plot) => plot.count) || []
    };
};
