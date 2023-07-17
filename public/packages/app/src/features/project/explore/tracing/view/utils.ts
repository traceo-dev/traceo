import { Span, TreeSpan } from "@traceo/types";

/**
 * Space from the left for duration bar calculated based on root start_time and duration.
 */
export const calculateLeftSpacePercentage = (
  rootStartTime: number,
  rootDuration: number,
  childStartTime: number
): number => {
  const relativeStartPosition = (childStartTime - rootStartTime) / rootDuration;
  const leftSpacePercentage = relativeStartPosition * 1e5;

  return leftSpacePercentage;
};

/**
 * Method to create spans tree by parent_span_id and span_id.
 * Child spans are collected inside childrens array.
 */
export const createSpansTree = (payload: Span[]): TreeSpan[] => {
  const spansMap = new Map<string, TreeSpan>();

  for (const span of payload) {
    const { span_id, parent_span_id, ...rest } = span;
    spansMap[span_id] = { ...rest, parent_span_id, span_id, childrens: [] };

    if (parent_span_id && !spansMap[parent_span_id]) {
      spansMap[parent_span_id] = { ...rest, span_id: parent_span_id, childrens: [] };
    }
  }

  for (const span of payload) {
    const { span_id, parent_span_id } = span;

    if (parent_span_id) {
      const parentSpan = spansMap[parent_span_id];
      const currentSpan = spansMap[span_id];

      parentSpan.childrens.push(currentSpan);
    }
  }

  const rootSpans: TreeSpan[] = [];
  for (const span of payload) {
    if (!span.parent_span_id) {
      rootSpans.push(spansMap[span.span_id]);
    }
  }

  return rootSpans;
};
