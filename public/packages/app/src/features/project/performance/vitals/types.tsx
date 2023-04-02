import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";
import { VitalsEnum, VitalsHealthType } from "@traceo/types";
import { SelectOptionProps } from "@traceo/ui";
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

export const mapHealthToName: Record<VitalsHealthType, string> = {
  good: "Good",
  need_improvement: "Need improvement",
  poor: "Poor"
};

export const mapHealthToIcon: Record<VitalsHealthType, JSX.Element> = {
  good: <SmileOutlined style={{ color: healthColor["good"] }} />,
  need_improvement: <MehOutlined style={{ color: healthColor["need_improvement"] }} />,
  poor: <FrownOutlined style={{ color: healthColor["poor"] }} />
};

export const selectHealthOptions: SelectOptionProps[] = [
  {
    label: mapHealthToName["good"],
    icon: mapHealthToIcon["good"],
    value: "good"
  },
  {
    label: mapHealthToName["need_improvement"],
    icon: mapHealthToIcon["need_improvement"],
    value: "need_improvement"
  },
  {
    label: mapHealthToName["poor"],
    icon: mapHealthToIcon["poor"],
    value: "poor"
  }
];
