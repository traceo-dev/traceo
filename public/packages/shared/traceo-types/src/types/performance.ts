export enum VitalsEnum {
  FID = "FID",
  FCP = "FCP",
  FP = "FP",
  LCP = "LCP",
  CLS = "CLS"
}

export type VitalsBinType = {
  bin: number;
  count: number;
};

export type VitalsResponse = {
  [x: string]: VitalsBinType[];
};

// Search for performances query
export type PerformanceQuery = {
  from: number;
  to: number;

  search: string;
  health: VitalsHealthType;

  // List of names (like FID, CLS, FCP) from clickhouse performance table and name column
  fields: string[];
};

/**
 * Performance representation in clickhouse db
 */
export type Performance = {
  id: string;
  // Name of the saved performance data eq. FID, CLS, FCP
  name: string;
  health: VitalsHealthType;
  value: number;
  // In long term definition eq. miliseconds, seconds etc.
  unit: string;
  // Name of the event used to scrap this data like: largest-contentful-paint, paint or navigation
  event: string;
  // Time when SDK fetch this data from browser
  timestamp: string;
  // Time when worker saved this data in db
  receive_timestamp: string;
  project_id: string;
};

export const MAP_INTERVAL: Record<VitalsEnum, number> = {
  [VitalsEnum.CLS]: 0.01,
  [VitalsEnum.FID]: 0.2,
  [VitalsEnum.FCP]: 100,
  [VitalsEnum.FP]: 100,
  [VitalsEnum.LCP]: 100
};

export const MAP_MAX_VALUE: Record<VitalsEnum, number> = {
  [VitalsEnum.CLS]: 0.5,
  [VitalsEnum.FID]: 10,
  [VitalsEnum.FCP]: 1000,
  [VitalsEnum.FP]: 1000,
  [VitalsEnum.LCP]: 1000
};

export const getHealthByValue = (type: VitalsEnum, value: number): VitalsHealthType => {
  const threshold = VITALS_THRESHOLD[type];

  if (value >= threshold.good.min && value <= threshold.good.max) {
    return "good";
  }

  if (value >= threshold.need_improvement.min && value <= threshold.need_improvement.max) {
    return "need_improvement";
  }

  if (value >= threshold.poor.min && value <= threshold.poor.max) {
    return "poor";
  }

  return undefined;
};

export type VitalsHealthType = "good" | "need_improvement" | "poor";

export type Range = {
  min: number;
  max: number;
};
export type ThresholdRange = {
  good: Range;
  need_improvement: Range;
  poor: Range;
};

export const VITALS_THRESHOLD: Record<VitalsEnum, ThresholdRange> = {
  [VitalsEnum.CLS]: {
    good: {
      min: 0,
      max: 0.1
    },
    need_improvement: {
      min: 0.11,
      max: 0.25
    },
    poor: {
      min: 0.26,
      max: Infinity
    }
  },
  [VitalsEnum.FCP]: {
    good: {
      min: 0,
      max: 1000
    },
    need_improvement: {
      min: 1001,
      max: 3000
    },
    poor: {
      min: 3001,
      max: Infinity
    }
  },
  [VitalsEnum.FP]: {
    good: {
      min: 0,
      max: 1000
    },
    need_improvement: {
      min: 1001,
      max: 3000
    },
    poor: {
      min: 3001,
      max: Infinity
    }
  },
  [VitalsEnum.FID]: {
    good: {
      min: 0,
      max: 100
    },
    need_improvement: {
      min: 101,
      max: 300
    },
    poor: {
      min: 301,
      max: Infinity
    }
  },
  [VitalsEnum.LCP]: {
    good: {
      min: 0,
      max: 2500
    },
    need_improvement: {
      min: 2501,
      max: 4000
    },
    poor: {
      min: 4001,
      max: Infinity
    }
  }
};
