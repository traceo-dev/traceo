/* eslint-disable */

import { Setter } from "@traceo/types";
import dayjs from "dayjs";
import uPlot from "uplot";

const setSelect = (self: uPlot, onZoom: Setter<[number, number]>) => {
    if (self.select.width > 0) {
        const min = self.posToVal(self.select.left, "x");
        const max = self.posToVal(self.select.left + self.select.width, "x");

        // trigger function to fetch data from server 
        onZoom([min, max]);

        self.setScale("x", { min, max });

        // after all remove select area from chart
        self.setSelect(
            {
                width: 0,
                height: 0,
                left: 0,
                top: 0
            },
            false
        );
    }
};

export const hook = {
    setSelect
}
