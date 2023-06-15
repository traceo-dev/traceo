/* eslint-disable */

/**
 * Probably to remove in the future due to fact that stacked graph really not good represent data.
 *
 * source: https://github.dev/leeoniya/uPlot/blob/master/demos/stack.js
 */

import uPlot from "uplot";

const stack = (data: uPlot.AlignedData, omit: any) => {
    const data2 = [];
    let bands = [];

    const d0Len = data[0].length;
    const accum = Array(d0Len);

    for (let i = 0; i < d0Len; i++)
        accum[i] = 0;

    for (let i = 1; i < data.length; i++)
        data2.push(omit(i) ? data[i] : data[i].map((v, i) => (accum[i] += +v)));

    for (let i = 1; i < data.length; i++)
        !omit(i) && bands.push({
            series: [
                data.findIndex((s, j) => j > i && !omit(j)),
                i,
            ],
        });

    bands = bands.filter(b => b.series[1] > -1);

    return {
        data: [data[0]].concat(data2),
        bands,
    };
}

function getOpts(opts: uPlot.Options) {
    return {
        scales: {
            x: {
                time: false,
            },
        },
        ...opts
    };
}

export const stackedOptions = (options: uPlot.Options, data: uPlot.AlignedData = [[]]): {
    options: uPlot.Options,
    data: []
} => {
    // const options = getOpts(opts);
    console.log("stackedOptions")
    const stacked = stack(data, () => false);
    options.bands = stacked.bands;

    options.cursor = options.cursor || {};
    options.cursor.dataIdx = (_u, seriesIdx, closestIdx, _xValue) => {
        return data[seriesIdx][closestIdx] == null ? null : closestIdx;
    };

    options.series.forEach(s => {
        s.value = (_u, _v, si, i) => data[si][i];

        s.points = s.points || {};

        // scan raw unstacked data to return only real points
        s.points.filter = (u, seriesIdx, show, gaps) => {
            if (show) {
                let pts = [];
                data[seriesIdx].forEach((v, i) => {
                    v != null && pts.push(i);
                });
                return pts;
            }
        }
    });

    // force 0 to be the sum minimum this instead of the bottom series
    options.scales.y = {
        range: (_u, _min, max) => {
            let minMax = uPlot.rangeNum(0, max, 0.1, true);
            return [0, minMax[1]];
        }
    };

    // restack on toggle
    // options.hooks = {
    //     setSeries: [
    //         (u, _i) => {
    //             let stacked = stack(data, i => !u.series[i].show);
    //             u.delBand(null);
    //             stacked.bands.forEach(b => u.addBand(b));
    //             u.setData(stacked.data as uPlot.AlignedData);
    //         }
    //     ],
    // };

    return { options, data: stacked.data as any };
}
