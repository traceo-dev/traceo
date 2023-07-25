import { DASHBOARD_PANEL_TYPE } from "@traceo/types";
import dateUtils from "../../../../../core/utils/date";

const todayFormatter = () => {
  return (_self, splits, _axisIdx, _foundSpace, _foundIncr) => {
    return splits.map((split) => dateUtils.formatDate(split, "HH:mm"));
  };
};

export const getXAxisFormatter = (type: DASHBOARD_PANEL_TYPE) => {
  switch (type) {
    case "todays_events":
      return todayFormatter();
    default:
      return undefined;
  }
};
