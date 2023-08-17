import { Tooltip } from "@traceo/ui";

interface Props {
  leftTrim?: boolean;
  maxLength?: number;
  value: string;
}
export const Truncate = ({ leftTrim = false, maxLength = 100, value = "" }: Props) => {
  const shouldBeTruncated = value.length > maxLength;
  let truncatedValue = value;

  if (shouldBeTruncated) {
    truncatedValue = leftTrim
      ? value.slice(value.length - (maxLength - 4), value.length)
      : value.slice(0, maxLength - 4);

    if (leftTrim) {
      truncatedValue = "..." + truncatedValue;
    } else {
      truncatedValue = truncatedValue + "...";
    }

    return (
      <Tooltip title={<span className="whitespace-nowrap">{value}</span>}>
        <span>{truncatedValue}</span>
      </Tooltip>
    );
  }

  return <span>{truncatedValue}</span>;
};
