import { DASHBOARD_PANEL_TYPE } from "@traceo/types";
import dateUtils from "src/core/utils/date";

const todayFormatter = () => {
    return (_self, splits, _axisIdx, _foundSpace, _foundIncr) => {
        const splitsCount = splits.length - 1;
        // Last value should be formatted to 23:59 for todays plot instead of 00:00
        return splits.map((split, index) => {
            if (index === splitsCount) {
                return "23:59";
            }

            return dateUtils.formatDate(split, "HH:mm");
        });
    };
}


export const getXAxisFormatter = (type: DASHBOARD_PANEL_TYPE) => {
    switch (type) {
        case "todays_events":
            return todayFormatter();
        default:
            return undefined;
    }
};
