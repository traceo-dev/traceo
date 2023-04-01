import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";
import { VitalsEnum } from "@traceo/types";
import { healthColor } from "./utils";

export type VitalsDetailsType = {
  name: string;
  description: string;
  field: VitalsEnum;
};

export const VITALS_DETAILS: VitalsDetailsType[] = [
  {
    field: VitalsEnum.FID,
    name: "First input delay (FID)",
    description: `First input delay (FID) measures the time from when a user first interacts with your site to the time when the browser is actually able to respond to that interaction.`
  },
  {
    field: VitalsEnum.FP,
    name: "First Paint (FP)",
    description:
      "First Paint (FP) is the time between navigation and when the browser first renders pixels to the screen, rendering anything that is visually different from the default background color of the body."
  },
  {
    field: VitalsEnum.FCP,
    name: "First Contentful Paint (FCP)",
    description:
      "The First Contentful Paint (FCP) metric measures the time from when the page starts loading to when any part of the page's content is rendered on the screen."
  },
  {
    field: VitalsEnum.LCP,
    name: "Largest Contentful Paint (LCP)",
    description:
      "The Largest Contentful Paint (LCP) metric reports the render time of the largest image or text block visible within the viewport, relative to when the page first started loading."
  },
  {
    field: VitalsEnum.CLS,
    name: "Cumulative Layout Shift (CLS)",
    description:
      "CLS is a measure of the largest burst of layout shift scores for every unexpected layout shift that occurs during the entire lifespan of a page."
  }
];

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

export const mapHealthToName: Record<VitalsHealthType, string> = {
  good: "Good",
  need_improvement: "Need improvement",
  poor: "Poor"
};

export const maphealthToIcon: Record<VitalsHealthType, JSX.Element> = {
  good: <SmileOutlined style={{ color: healthColor["good"] }} />,
  need_improvement: <MehOutlined style={{ color: healthColor["need_improvement"] }} />,
  poor: <FrownOutlined style={{ color: healthColor["poor"] }} />
};
